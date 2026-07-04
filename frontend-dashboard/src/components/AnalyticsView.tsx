import type React from "react";
import { Brain, Clock, Cpu, Zap } from "lucide-react";

export const AnalyticsView: React.FC = () => {
    const tripData = [
        { tripId: 1, predicted: 12, actual: 14 },
        { tripId: 2, predicted: 18, actual: 17 },
        { tripId: 3, predicted: 15, actual: 19 },
        { tripId: 4, predicted: 22, actual: 21 },
        { tripId: 5, predicted: 9, actual: 10 },
        { tripId: 6, predicted: 14, actual: 13 },
        { tripId: 7, predicted: 25, actual: 27 },
    ];

    const width = 600;
    const height = 250;
    const padding = 40;

    const getCoordinates = (index: number, value: number) => {
        const x = padding + (index / (tripData.length - 1)) * (width - padding * 2);
        const y = height - padding - (value / 30) * (height - padding * 2);
        return `${x},${y}`;
    }

    const predictedPoints = tripData.map((d, i) => getCoordinates(i, d.predicted)).join(' ');
    const actualPoints = tripData.map((d, i) => getCoordinates(i, d.actual)).join(' ');

    return (
        <div style={{ padding: '30px', backgroundColor: '#121212', minHeight: '100%', boxSizing: 'border-box' }}>
        {/* View Header */}
        <div style={{ marginBottom: '30px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>📊 AI Insights & System KPIs</h1>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>
            Real-time metrics tracking Geohash processing speeds and predictive ML regression error bounds.
            </p>
        </div>

        {/* Grid Layout for high-level KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', padding: '12px', borderRadius: '6px', color: '#e50914' }}><Brain size={24} /></div>
            <div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>Model Core Accuracy</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>94.2%</div>
            </div>
            </div>

            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '12px', borderRadius: '6px', color: '#4caf50' }}><Zap size={24} /></div>
            <div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>Telemetry Ingestion Rate</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1.4k rps</div>
            </div>
            </div>

            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', padding: '12px', borderRadius: '6px', color: '#2196f3' }}><Cpu size={24} /></div>
            <div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>Inference Latency</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>14ms</div>
            </div>
            </div>

            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', padding: '12px', borderRadius: '6px', color: '#ff9800' }}><Clock size={24} /></div>
            <div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>Avg Response Allocation</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1.8 sec</div>
            </div>
            </div>
        </div>

        {/* ML Deviation Line Graph */}
        <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '25px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>AI Variance Matrix: Predicted vs. Actual ETAs</h3>
            <p style={{ margin: '0 0 25px 0', color: '#aaa', fontSize: '13px' }}>
            Monitors historical variance bounds to determine if spatial Geohash layers need model retraining cycles.
            </p>

            <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg width={width} height={height} style={{ backgroundColor: '#121212', borderRadius: '6px', overflow: 'visible' }}>
                {/* Grid Line Accents */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333" strokeWidth="1" />
                
                {/* Dynamic Polyline Data Mappings */}
                <polyline fill="none" stroke="#2196f3" strokeWidth="3" points={predictedPoints} strokeLinecap="round" strokeLinejoin="round" />
                <polyline fill="none" stroke="#e50914" strokeWidth="3" points={actualPoints} strokeLinecap="round" strokeLinejoin="round" />

                {/* Individual Data Intersect Nodes */}
                {tripData.map((d, i) => {
                const [pX, pY] = getCoordinates(i, d.predicted).split(',');
                const [aX, aY] = getCoordinates(i, d.actual).split(',');
                return (
                    <g key={i}>
                    <circle cx={pX} cy={pY} r="4" fill="#2196f3" />
                    <circle cx={aX} cy={aY} r="4" fill="#e50914" />
                    </g>
                );
                })}

                {/* Y-Axis Interval Labels */}
                <text x={padding - 10} y={height - padding + 5} fill="#666" fontSize="10" textAnchor="end">0m</text>
                <text x={padding - 10} y={height - padding - (15 / 30) * (height - padding * 2) + 5} fill="#666" fontSize="10" textAnchor="end">15m</text>
                <text x={padding - 10} y={padding + 5} fill="#666" fontSize="10" textAnchor="end">30m</text>

                {/* X-Axis Interval Labels */}
                {tripData.map((d, i) => {
                const [x] = getCoordinates(i, d.predicted).split(',');
                return (
                    <text key={i} x={x} y={height - padding + 20} fill="#666" fontSize="10" textAnchor="middle">
                    Run #{d.tripId}
                    </text>
                );
                })}
            </svg>
            </div>

            {/* Chart Color Legend Elements */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#2196f3', borderRadius: '2px' }}></span>
                <span style={{ color: '#ccc' }}>Python ML Predicted Engine ETA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#e50914', borderRadius: '2px' }}></span>
                <span style={{ color: '#ccc' }}>Actual PostGIS Trip Duration Log</span>
            </div>
            </div>
        </div>
        </div>
    );
}