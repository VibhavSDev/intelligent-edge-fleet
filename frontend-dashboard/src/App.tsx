import { useState } from 'react';
import { NavigationLayout } from './components/NavigationLayout';
import { ControlSidebar } from './components/ControlSidebar';
import { MapView } from './components/MapView';
import { useWebScokets } from './hooks/useWebSockets';

const FleetInventoryView = () => <div style={{ padding: '20px' }}><h2>🚚 Fleet Inventory Management</h2><p>Database CRUD management table loading...</p></div>;
const AnalyticsView = () => <div style={{ padding: '20px' }}><h2>📊 AI Insights & System KPIs</h2><p>Telemetry metrics, throughput clocks, and charts loading...</p></div>;
const IncidentLogsView = () => <div style={{ padding: '20px' }}><h2>📝 Incident Log History</h2><p>Audit trail logs directly from PostgreSQL loading...</p></div>;

function App() {
  const [currentTab, setCurrentTab] = useState<string>('live');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { fleet } = useWebScokets(backendUrl);

  return (
    <NavigationLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'live' && (
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
          <ControlSidebar />
          <div style={{ flexGrow: 1, position: 'relative', height: '100%' }}>
            <MapView fleet={fleet} />
          </div>
        </div>
      )}
      {currentTab === 'inventory' && <FleetInventoryView />}
      {currentTab === 'analytics' && <AnalyticsView />}
      {currentTab === 'logs' && <IncidentLogsView />}
    </NavigationLayout>
  );
}

export default App