import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getEnergyData } from '../../api/dashboard.api';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export default function EnergyAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnergyData().then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;
  if (!data) return <div className="page-body"><div className="empty-state"><h3>No Data</h3></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Energy Analysis</h1><div className="subtitle">Health and energy patterns</div></div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Avg Sleep</div><div className="stat-value">{data.avgSleepHours?.toFixed(1)}h</div></div>
          <div className="stat-card"><div className="stat-label">Avg Exercise</div><div className="stat-value">{data.avgExerciseMinutes?.toFixed(0)}m</div></div>
          <div className="stat-card"><div className="stat-label">Avg Coffee</div><div className="stat-value">{data.avgCoffeeIntake?.toFixed(0)}mg</div></div>
          <div className="stat-card"><div className="stat-label">Avg Breaks</div><div className="stat-value">{data.avgBreaksPerDay?.toFixed(1)}</div></div>
        </div>
        <div className="charts-grid">
          <div className="card">
            <div className="card-header">Sleep Distribution</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.sleepDistribution || []}>
                  <XAxis dataKey="range" fontSize={10} angle={-30} textAnchor="end" height={60} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Exercise Distribution</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.exerciseDistribution || []}>
                  <XAxis dataKey="range" fontSize={10} angle={-30} textAnchor="end" height={60} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
