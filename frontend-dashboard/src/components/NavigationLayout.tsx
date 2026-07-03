import { Activity, BarChart3, FileText, Truck } from "lucide-react";
import type React from "react";

interface NavigationLayoutProps {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    children: React.ReactNode;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({ currentTab, setCurrentTab, children }) => {
    const navItems = [
        { id: 'live', name: 'Live Operations', icon: Activity },
        { id: 'inventory', name: 'Fleet Inventory', icon: Truck },
        { id: 'analytics', name: 'AI Insights', icon: BarChart3 },
        { id: 'logs', name: 'Incident Logs', icon: FileText },
    ];

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
        {/* Sidebar navigation */}
        <div style={{ width: '260px', backgroundColor: '#1a1a1a', borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', padding: '20px 10px' }}>
            <div style={{ padding: '0 10px 20px 10px', fontSize: '18px', fontWeight: 'bold', color: '#e50914', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Intelligent Edge Fleet</span>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                    backgroundColor: isActive ? '#e50914' : 'transparent', color: isActive ? '#fff' : '#aaa',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: isActive ? 'bold' : 'normal', transition: '0.2s'
                    }}
                >
                    <Icon size={18} />
                    {item.name}
                </button>
                );
            })}
            </nav>
            <div style={{ padding: '10px', fontSize: '12px', color: '#555', borderTop: '1px solid #2a2a2a' }}>
            v1.0.0 (Production Cluster)
            </div>
        </div>

        {/* Main Content Viewport */}
        <div style={{ flexGrow: 1, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {children}
        </div>
        </div>
    );
}