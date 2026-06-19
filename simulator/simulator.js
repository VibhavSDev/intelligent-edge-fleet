import io from 'socket.io-client';
import * as turf from '@turf/turf';

const SOCKET_URL = 'http://localhost:5000'; 
const socket = io(SOCKET_URL);

// Coordinates for a mock route
const routePoints = [
    [-74.0060, 40.7128], // Starting point
    [-73.9980, 40.7200], // Waypoint 1
    [-73.9900, 40.7150], // Waypoint 2
    [-73.9850, 40.7306]  // Ending point
]

const line = turf.lineString(routePoints);
const routeLength = turf.length(line, { units: 'kilometers' });

const FLEET_SIZE = 5;
const VEHICLE_SPEED_KMH = 50;
const UPDATE_INTERVAL_MS = 2000;

const fleet = [];

function initializeFleet() {
    for (let i = 0; i < FLEET_SIZE; i++) {
        fleet.push({
            id: `AMB_UNIT_${100 + i}`,
            distanceTraveled: (routeLength / FLEET_SIZE) * i,
            direction: 1 // 1 = moving forward, -1 = moving backward on route
        });
    }
    console.log(`Fleet Simulation Initialized: ${FLEET_SIZE} vehicles online.`);
}

// Heartbeat function executing telemetry computations and streaming data packets
function runSimulation() {
    setInterval(() => {
        if(!socket.connected) {
            console.log('Simulator disconnected from core cluster. Retrying...');
            return;
        }

        const hoursPassed = UPDATE_INTERVAL_MS / (1000 * 60 * 60);
        const deltaDistance = VEHICLE_SPEED_KMH * hoursPassed;

        fleet.forEach((vehicle) => {
            vehicle.distanceTraveled += deltaDistance * vehicle.direction;

            // Handle boundary turnarounds if the vehicle hits the end or start of route
            if(vehicle.distanceTraveled >= routeLength) {
                vehicle.direction = -1;
                vehicle.distanceTraveled = routeLength;
            } else if(vehicle.distanceTraveled <= 0) {
                vehicle.direction = 1;
                vehicle.distanceTraveled = 0;
            }

            const currentPoint = turf.along(line, vehicle.distanceTraveled, { units: 'kilometers' });
            const [lng, lat] = currentPoint.geometry.coordinates;

            const telemetryPayload = {
                vehicle_id: vehicle.id,
                lat: parseFloat(lat.toFixed(6)),
                lng: parseFloat(lng.toFixed(6)),
                timestamp: Date.now()
            };

            socket.emit('telemetry_ping', telemetryPayload);
        });

    }, UPDATE_INTERVAL_MS);
}

socket.on('connect', () => {
    console.log('📡 Connected to Fleet Core backend ingestion cluster!');
})

initializeFleet();
runSimulation();