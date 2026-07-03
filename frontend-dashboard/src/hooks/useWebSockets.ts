import { useState, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export interface vehicleTelemetry {
    vehicle_id: string;
    lat: number;
    lng: number;
    timestamp: number;
}

export const useWebScokets = (backendUrl: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [fleetState, setFleetState] = useState<Record<String, vehicleTelemetry>>({});

    useEffect(() => {
        const socketInstance = io(backendUrl);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Dashboard connected to real-time telemetry pipeline');
        });

        socketInstance.on('fleet-update', (data: vehicleTelemetry) => {
            setFleetState((prevState) => ({
                ...prevState,
                [data.vehicle_id]: data
            }));
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [backendUrl]);

    return { socket, fleet: Object.values(fleetState) };
}