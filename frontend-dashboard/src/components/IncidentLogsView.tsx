import { AlertTriangle, CheckCircle, CloudSun, FileText, Search, XCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface IncidentLog {
    id: number;
    vehicle_id: string;
    status: 'EN_ROUTE' | 'COMPLETED' | 'CANCELLED';
    weather_condition: string;
    predicted_eta_seconds: number;
    actual_duration_seconds: number | null;
    created_at: string;
}

export const IncidentLogsView: React.FC = () => {
    const [logs, setLogs] = useState<IncidentLog[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [weatherFilter, setWeatherFilter] = useState<string>('ALL');

    useEffect(() => {
        setLogs([
            { id: 1004, vehicle_id: 'AMB_UNIT_102', status: 'COMPLETED', weather_condition: 'RAIN', predicted_eta_seconds: 810, actual_duration_seconds: 780, created_at: '2026-07-04 21:34' },
            { id: 1003, vehicle_id: 'AMB_UNIT_101', status: 'COMPLETED', weather_condition: 'CLEAR', predicted_eta_seconds: 540, actual_duration_seconds: 600, created_at: '2026-07-04 20:15' },
            { id: 1002, vehicle_id: 'AMB_UNIT_102', status: 'COMPLETED', weather_condition: 'CLEAR', predicted_eta_seconds: 620, actual_duration_seconds: 615, created_at: '2026-07-04 18:42' },
            { id: 1001, vehicle_id: 'AMB_UNIT_105', status: 'EN_ROUTE', weather_condition: 'STORMY', predicted_eta_seconds: 1120, actual_duration_seconds: null, created_at: '2026-07-04 21:55' },
            { id: 1005, vehicle_id: 'AMB_UNIT_103', status: 'CANCELLED', weather_condition: 'SNOW', predicted_eta_seconds: 900, actual_duration_seconds: null, created_at: '2026-07-04 22:00' },
        ]);
    }, []);

    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.vehicle_id.toLowerCase().includes(searchQuery.toLowerCase()) || log.id.toString().includes(searchQuery);
        const matchesWeather = weatherFilter === 'ALL' || log.weather_condition === weatherFilter;
        return matchesSearch && matchesWeather;
    });

    const formatTime = (seconds: number | null) => {
        if(seconds === null) return '--';
        return `${(seconds / 60).toFixed(1)} mins`;
    }

    return (
        <div style={{ padding: '30px', backgroundColor: '#121212', minHeight: '100%', boxSizing: 'border-box' }}>
        {/* Module Title Section */}
        <div style={{ marginBottom: '30px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={28} color="#e50914" /> Incident Log History
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>
            Persistent historical audit trail tracking system lifecycle state changes resolved directly from PostgreSQL.
            </p>
        </div>

        {/* Audit Pipeline Filtering Engine */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0 15px', flexGrow: 1 }}>
            <Search size={18} color="#666" />
            <input 
                type="text" 
                placeholder="Search audit files by Incident ID or Asset Code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 0', backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' }}
            />
            </div>
            <select 
            value={weatherFilter}
            onChange={(e) => setWeatherFilter(e.target.value)}
            style={{ padding: '0 20px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
            <option value="ALL">All Environments</option>
            <option value="CLEAR">Clear Weather</option>
            <option value="RAIN">Rain Ingestion</option>
            <option value="STORMY">Storm Concurrency</option>
            <option value="SNOW">Snow Ingestion</option>
            </select>
        </div>

        {/* Incident Log Data Grid */}
        <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a', backgroundColor: '#222' }}>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Incident ID</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Assigned Asset</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Lifecycle State</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Weather Matrix</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>ML Target ETA</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Actual Ingestion Time</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Dispatch Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #2a2a2a', transition: '0.2s' }}>
                    <td style={{ padding: '15px 20px', color: '#e50914', fontWeight: 'bold', fontSize: '14px' }}>#{log.id}</td>
                    <td style={{ padding: '15px 20px', color: '#fff', fontWeight: '500', fontSize: '14px' }}>{log.vehicle_id}</td>
                    <td style={{ padding: '15px 20px' }}>
                        {log.status === 'COMPLETED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4caf50', fontSize: '13px', fontWeight: '600' }}><CheckCircle size={14} /> Completed</span>
                        )}
                        {log.status === 'EN_ROUTE' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ff9800', fontSize: '13px', fontWeight: '600' }}><AlertTriangle size={14} /> En Route</span>
                        )}
                        {log.status === 'CANCELLED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f44336', fontSize: '13px', fontWeight: '600' }}><XCircle size={14} /> Cancelled</span>
                        )}
                    </td>
                    <td style={{ padding: '15px 20px', color: '#ccc', fontSize: '13px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CloudSun size={14} color="#666" /> {log.weather_condition}</span>
                    </td>
                    <td style={{ padding: '15px 20px', color: '#2196f3', fontWeight: '500', fontSize: '14px' }}>{formatTime(log.predicted_eta_seconds)}</td>
                    <td style={{ padding: '15px 20px', color: log.actual_duration_seconds ? '#fff' : '#666', fontSize: '14px' }}>{formatTime(log.actual_duration_seconds)}</td>
                    <td style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>{log.created_at}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No historical incident records match the filters.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};