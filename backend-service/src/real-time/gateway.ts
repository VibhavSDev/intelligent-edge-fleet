import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import redisClient from '../config/redis.js';

export const initWebSocketGateway = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`New entity connected to ingestion cluster: ${socket.id}`);

        socket.on('telemetry-ping', async (data: { vehicle_id: string; lat: number; lng: number; timestamp: number }) => {
            try {
                const { vehicle_id, lat, lng, timestamp } = data;
            
                if (!vehicle_id || !lat || !lng) return;

                console.log(`[TELEMETRY] Vehicle ${vehicle_id} -> Lat: ${lat}, Lng: ${lng}`);

                await redisClient.geoAdd('fleet-locations', { longitude: lng, latitude: lat, member: vehicle_id });

                await redisClient.hSet('fleet:last_seen', vehicle_id, timestamp.toString());

                io.emit('fleet-update', { vehicle_id, lat, lng, timestamp });
            } catch (error) {
                console.error('Error handling telemetry ingestion ping:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Entity disconnected from ingestion cluster: ${socket.id}`);
        });
    });

    return io;
}