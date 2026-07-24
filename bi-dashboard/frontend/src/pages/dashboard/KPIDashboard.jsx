import { useState, useEffect } from 'react';
import { getKPIData } from '../../api/dashboard.api';
import { TrendingUp, UserCheck, Target, Monitor, Award, Activity } from 'lucide-react';

const ICONS = { TrendingUp, UserCheck, Target, Monitor, Award, Activity };

export default function KPIDashboard() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKPIData().then(({ data }) => { setKpis(data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>KPI Dashboard</h1><div className="subtitle">Key Performance Indicators</div></div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          {kpis.map((kpi, i) => {
            const Icon = ICONS[kpi.icon] || TrendingUp;
            return (
              <div key={i} className={`stat-card ${kpi.status === 'on-track' ? 'good' : 'warning'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Icon size={16} />
                  <div className="stat-label">{kpi.name}</div>
                </div>
                <div className="stat-value">{kpi.value}</div>
                <div className="stat-sub">Target: {kpi.target}</div>
                <div className="progress-bar">
                  <div className={`fill ${kpi.status === 'on-track' ? 'good' : 'warning'}`}
                    style={{ width: `${Math.min(100, (parseFloat(kpi.value) / kpi.target) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
