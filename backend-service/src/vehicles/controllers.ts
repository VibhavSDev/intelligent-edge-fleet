import { Request, Response } from "express";
import redisClient from "../config/redis.js";

export const getNearestVehicles = async (req: Request, res: Response): Promise<any> => {
    try {
        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);
        const radiusInKm = parseFloat(req.query.radius as string) || 5;

        if(isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Missing or invalid latitude/longitude query parameters.' });
        }

        const nearbyEntities = await redisClient.geoSearchWith(
            'fleet-locations',
            { longitude: lng, latitude: lat },
            { radius: radiusInKm, unit: 'km' },
            ['WITHCOORD', 'WITHDIST']
        );

        const formattedVehicles = nearbyEntities.map((item) => ({
            vehicle_id: item.member,
            distance_km: parseFloat(item.distance!.toFixed(2)),
            location: {
                lng: item.coordinates!.longitude,
                lat: item.coordinates!.latitude,
            }
        }))

        return res.status(200).json({
            center: { lat, lng },
            radius_km: radiusInKm,
            results_count: formattedVehicles.length,
            vehicles: formattedVehicles,
        });
    } catch (error) {
        console.error('Error executing proximity lookup query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}