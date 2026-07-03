import type React from "react";
import { useState } from "react";

export const ControlSidebar: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [etaResult, setEtaResult] = useState<any>(null);

    const triggerDispatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setEtaResult(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trips/dispatch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    pipickup_lat: 40.7128,
                    pickup_lng: -74.0060,
                    dropoff_lat: 40.7306,
                    dropoff_lng: -73.9850
                })
            });

            const data = await response.json();
            setEtaResult(data);
        } catch (err) {
            console.error('Dispatch event failed: ', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ width: '350px', backgroundColor: '#1a1a1a', color: '#fff', padding: '20px', zIndex: 10 }}>
        <h2>🚑 Command Center</h2>
        <p style={{ fontSize: '14px', color: '#aaa' }}>Emergency Route Allocator</p>
        <hr style={{ borderColor: '#333' }} />

        <button 
            onClick={triggerDispatch} 
            disabled={loading}
            style={{
            width: '100%', padding: '12px', backgroundColor: '#e50914', 
            color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}
        >
            {loading ? 'Querying AI Cluster...' : '🚨 Dispatch Closest Vehicle'}
        </button>

        {etaResult && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
            <h4>Allocation Matrix Confirmed</h4>
            <p><strong>Assigned ID:</strong> {etaResult.assignedVehicleId}</p>
            <p><strong>AI Predicted ETA:</strong> {etaResult.trip?.predicted_eta_seconds ? `${(etaResult.trip.predicted_eta_seconds / 60).toFixed(1)} mins` : 'N/A'}</p>
            <p><strong>Route Status:</strong> <span style={{ color: '#4caf50' }}>{etaResult.trip?.status}</span></p>
            </div>
        )}
        </div>
    );
}