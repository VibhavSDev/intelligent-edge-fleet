import { Request, Response } from "express"
import { TripService } from "./services.js";

const tripService = new TripService();

export const dispatchEmergencyRoute = async(req: Request, res: Response): Promise<any> => {
    try {
        const { pickupLat, pickupLng, dropoffLat, dropoffLng } = req.body;

        if(!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
            return res.status(400).json({ error: 'Missing required location parameters' });
        }

        const result = await tripService.createTrip(pickupLat, pickupLng, dropoffLat, dropoffLng);
        return res.status(201).json({
            message: 'Emergency route dispatched successfully.',
            ...result
        });
    } catch (error: any) {
        console.error('Dispatch failed:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

export const completeTrip = async(req: Request, res: Response): Promise<any> => {
    try {
        const tripId = parseInt(req.params.id);
        const { actual_duration_seconds } = req.body;
        if(isNaN(tripId) || !actual_duration_seconds) {
            return res.status(400).json({ error: 'Invalid payload constraints.' });
        }

        const trip = await tripService.completeTrip(tripId, actual_duration_seconds);
        return res.status(200).json({
            message: 'Trip completed successfully.',
            trip
        });
    } catch (error: any) {
        console.error('Failed to complete trip:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}