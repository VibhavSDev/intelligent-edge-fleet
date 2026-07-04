import { Plus, Search, Shield, ShieldAlert, WifiOff, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Vehicle {
    id: string;
    license_plate: string;
    status: 'IDLE' | 'ACTIVE' | 'OFFLINE';
    last_ping: string;
}

export const FleetInventoryView: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'IDLE' | 'ACTIVE' | 'OFFLINE'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [newId, setNewId] = useState<string>('');
    const [newPlate, setNewPlate] = useState<string>('');
    const [newStatus, setNewStatus] = useState<'IDLE' | 'ACTIVE' | 'OFFLINE'>('IDLE');

    useEffect(() => {
        setVehicles([
        { id: 'AMB_UNIT_101', license_plate: 'NY-EM-9921', status: 'IDLE', last_ping: new Date().toLocaleTimeString() },
        { id: 'AMB_UNIT_102', license_plate: 'NY-EM-4412', status: 'ACTIVE', last_ping: new Date().toLocaleTimeString() },
        { id: 'AMB_UNIT_103', license_plate: 'NY-EM-7781', status: 'OFFLINE', last_ping: '2 hours ago' },
        ]);
    }, []);

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newId || !newPlate) return;

        const newVehicle: Vehicle = {
            id: newId.trim().toUpperCase(),
            license_plate: newPlate.trim().toUpperCase(),
            status: newStatus,
            last_ping: 'Just registered',
        }

        setVehicles([newVehicle, ...vehicles]);
        setNewId('');
        setNewPlate('');
        setNewStatus('IDLE');
        setIsModalOpen(false);
    }

    const filteredVehicles = vehicles.filter((v) => {
        const matchesSearch = v.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'IDLE':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', fontWeight: 'bold' }}><Shield size={14} /> Available</span>;
            case 'ACTIVE':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', backgroundColor: 'rgba(229, 9, 20, 0.15)', color: '#e50914', fontWeight: 'bold' }}><ShieldAlert size={14} /> Emergency Run</span>;
            default:
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', backgroundColor: 'rgba(170, 170, 170, 0.15)', color: '#aaa', fontWeight: 'bold' }}><WifiOff size={14} /> Offline</span>;
        }
    }

    return (
        <div style={{ padding: '30px', backgroundColor: '#121212', minHeight: '100%', boxSizing: 'border-box' }}>
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>🚚 Fleet Inventory Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>Register, monitor, and query live vehicle assets configured in PostgreSQL.</p>
            </div>
            <button 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
            >
            <Plus size={18} /> Register Asset
            </button>
        </div>

        {/* Control / Filter row */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '0 15px', flexGrow: 1 }}>
            <Search size={18} color="#666" />
            <input 
                type="text" 
                placeholder="Search by Vehicle ID or License Plate..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 0', backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' }}
            />
            </div>
            <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0 20px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
            <option value="ALL">All Statuses</option>
            <option value="IDLE">Available (Idle)</option>
            <option value="ACTIVE">Emergency (Active)</option>
            <option value="OFFLINE">Offline</option>
            </select>
        </div>

        {/* Main Datatable */}
        <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a', backgroundColor: '#222' }}>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Vehicle Asset ID</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>License Plate</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Operational Status</th>
                <th style={{ padding: '15px 20px', color: '#aaa', fontSize: '14px', fontWeight: '600' }}>Last Ingestion Ping</th>
                </tr>
            </thead>
            <tbody>
                {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} style={{ borderBottom: '1px solid #2a2a2a', transition: '0.2s' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold', fontSize: '14px' }}>{vehicle.id}</td>
                    <td style={{ padding: '15px 20px', color: '#ccc', fontSize: '14px' }}>{vehicle.license_plate}</td>
                    <td style={{ padding: '15px 20px' }}>{getStatusBadge(vehicle.status)}</td>
                    <td style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>{vehicle.last_ping}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No vehicle records match the filters.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Slide-out / Pop-up Registration Modal */}
        {isModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', width: '450px', padding: '25px', position: 'relative' }}>
                <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                <X size={20} />
                </button>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Register New Fleet Asset</h3>
                <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#aaa' }}>Asset Identifier ID</label>
                    <input type="text" placeholder="e.g. AMB_UNIT_104" value={newId} onChange={(e) => setNewId(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '4px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#aaa' }}>License Plate Code</label>
                    <input type="text" placeholder="e.g. NY-EM-1102" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} required style={{ width: '100%', padding: '10px', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '4px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#aaa' }}>Initial Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} style={{ width: '100%', padding: '10px', backgroundColor: '#121212', border: '1px solid #333', borderRadius: '4px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                    <option value="IDLE">Available (Idle)</option>
                    <option value="ACTIVE">Emergency Run (Active)</option>
                    <option value="OFFLINE">Offline</option>
                    </select>
                </div>
                <button type="submit" style={{ marginTop: '10px', padding: '12px', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Confirm Registration
                </button>
                </form>
            </div>
            </div>
        )}
        </div>
    );
}