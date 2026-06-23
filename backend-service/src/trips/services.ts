import db from "../config/db.js";
import redisClient from "../config/redis.js";


export class TripService {

    async createTrip(pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) {
        const client = await db.pool.connect();
        try {
            const nearbyVehicles = await redisClient.geoSearchWith(
                'fleet:locations',
                { longitude: pickupLng, latitude: pickupLat },
                { radius: 10, unit: 'km' },
                ['WITHDIST']
            );

            let assignedVehicleId: string | null = null;
            for(const vehicle of nearbyVehicles) {
                const vId = vehicle.member;
                const statusCheck = await db.query('SELECT status FROM vehicles WHERE id = $1', [vId]);
                if (statusCheck.rows.length > 0 && statusCheck.rows[0].status === 'IDLE') {
                    assignedVehicleId = vId;
                    break;
                }
            }

            if(!assignedVehicleId) {
                throw new Error('No available IDLE emergency vehicles within proximity.');
            }

            let predictedEtaSeconds = 900;
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
            const weatherCondition = 'CLEAR';

            try {
                const response = await fetch(`${mlServiceUrl}/predict-eta`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pickup_lat: pickupLat,
                        pickup_lng: pickupLng,
                        dropoff_lat: dropoffLat,
                        dropoff_lng: dropoffLng,
                        weather_condition: weatherCondition
                    })
                });

                if(response.ok) {
                    const mlData = await response.json();
                    predictedEtaSeconds = mlData.predicted_duration_seconds;
                    console.log(`AI Inference Success: Predicted duration is ${predictedEtaSeconds}s (${mlData.predicted_minutes} mins)`);
                } else {
                    console.warn(`ML Service responded with status ${response.status}. Using baseline fallback.`);
                }
            } catch (mlError) {
                console.error('Failed to reach ML Inference service cluster. Falling back to baseline.', mlError);
            }

            await client.query('BEGIN');

            await client.query(
                `UPDATE vehicles SET status = 'ACTIVE' WHERE id = $1`,
                [assignedVehicleId]
            );

            const insertTripQuery = `
                INSERT INTO trips (vehicle_id, status, pickup_location, dropoff_location, weather_condition, predicted_eta_seconds)
                VALUES (
                $1,
                'EN_ROUTE',
                ST_SetSRID(ST_MakePoint($2, $3), 4326),
                ST_SetSRID(ST_MakePoint($4, $5), 4326),
                $6,
                $7
                ) RETURNING *;
            `;
            
            const tripResult = await client.query(insertTripQuery, [
                assignedVehicleId,
                pickupLng,
                pickupLat,
                dropoffLng,
                dropoffLat,
                weatherCondition,
                predictedEtaSeconds
            ]);

            await client.query('COMMIT');
            return { trip: tripResult.rows[0], assignedVehicleId };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async completeTrip(tripId: number, actualDurationSeconds: number) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const tripCheck = await client.query('SELECT vehicle_id, status FROM trips WHERE id = $1', [tripId]);
            if(tripCheck.rows.length === 0) throw new Error('Trip record not found.');
            if(tripCheck.rows[0].status === 'COMPLETED') throw new Error('Trip is already completed.');

            const vehicleId = tripCheck.rows[0].vehicle_id;

            const updateTripQuery = `
                UPDATE trips 
                SET status = 'COMPLETED', actual_duration_seconds = $2, completed_at = CURRENT_TIMESTAMP
                WHERE id = $1 RETURNING *;
            `;
            const tripResult = await client.query(updateTripQuery, [tripId, actualDurationSeconds]);

            await client.query(`UPDATE vehicles SET status = 'IDLE' WHERE id = $1`, [vehicleId]);

            await client.query('COMMIT');
            return tripResult.rows[0];
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}