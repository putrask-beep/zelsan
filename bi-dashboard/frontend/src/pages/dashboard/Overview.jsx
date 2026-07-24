import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Target, Activity } from 'lucide-react';
import { getOverview } from '../../api/analysis.api';

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: overview } = await getOverview();
        setData(overview);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;
  if (!data || !data.totalStudents) {
    return (
      <div className="page-body">
        <div className="page-header"><div><h1>Overview</h1><div className="subtitle">Executive Dashboard</div></div></div>
        <div className="empty-state">
          <h3>No Data Available</h3>
          <p>Upload a dataset to see the dashboard overview.</p>
        </div>
      </div>
    );
  }

  const genderData = data.genderDistribution || [];

  return (
    <div>
      <div className="page-header">
        <div><h1>Overview</h1><div className="subtitle">Executive Dashboard</div></div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{data.totalStudents}</div>
          </div>
          <div className={`stat-card ${data.avgProductivity >= 50 ? 'good' : 'warning'}`}>
            <div className="stat-label">Avg Productivity</div>
            <div className="stat-value">{data.avgProductivity?.toFixed(1)}</div>
            <div className="stat-sub">Target: 50</div>
          </div>
          <div className={`stat-card ${data.avgFocusScore >= 60 ? 'good' : 'warning'}`}>
            <div className="stat-label">Avg Focus Score</div>
            <div className="stat-value">{data.avgFocusScore?.toFixed(1)}</div>
            <div className="stat-sub">Target: 60</div>
          </div>
          <div className={`stat-card ${data.avgAttendance >= 80 ? 'good' : 'warning'}`}>
            <div className="stat-label">Avg Attendance</div>
            <div className="stat-value">{data.avgAttendance?.toFixed(1)}%</div>
            <div className="stat-sub">Target: 80%</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card">
            <div className="card-header">Key Metrics</div>
            <div className="card-body">
              <BarChart width={500} height={300} data={[
                { name: 'Study Hrs', value: data.avgStudyHours?.toFixed(1) },
                { name: 'Sleep Hrs', value: data.avgSleepHours?.toFixed(1) },
                { name: 'Phone Hrs', value: data.avgPhoneUsage?.toFixed(1) },
                { name: 'Gaming Hrs', value: data.avgGamingHours?.toFixed(1) },
                { name: 'Social Hrs', value: data.avgSocialMediaHours?.toFixed(1) },
                { name: 'Exercise', value: (data.avgExerciseMinutes / 60)?.toFixed(1) }
              ]}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Gender Distribution</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={genderData} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} label={({ label, count }) => `${label}: ${count}`}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Stress Level Distribution</div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.stressDistribution || []}>
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
