import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getDatasetById, getDatasetStudents } from '../../api/dataset.api';

export default function DatasetDetail() {
  const { id } = useParams();
  const [dataset, setDataset] = useState(null);
  const [students, setStudents] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDatasetById(id), getDatasetStudents(id)]).then(([ds, st]) => {
      setDataset(ds.data);
      setStudents(st.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-body"><p>Loading...</p></div>;
  if (!dataset) return <div className="page-body"><div className="empty-state"><h3>Dataset Not Found</h3></div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{dataset.name}</h1>
          <div className="subtitle">{dataset.originalFilename} • {dataset.rowCount} rows • {dataset.columnCount} columns</div>
        </div>
        <Link to="/dashboard/datasets" className="btn btn-outline btn-sm">Back to List</Link>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Status</div><div className="stat-value" style={{ fontSize: '1rem' }}>{dataset.status}</div></div>
          <div className="stat-card"><div className="stat-label">Rows</div><div className="stat-value">{dataset.rowCount}</div></div>
          <div className="stat-card"><div className="stat-label">Columns</div><div className="stat-value">{dataset.columnCount}</div></div>
          <div className="stat-card"><div className="stat-label">File Size</div><div className="stat-value" style={{ fontSize: '1rem' }}>{(dataset.fileSize / 1024).toFixed(1)} KB</div></div>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header">Columns</div>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {dataset.columns?.map((col, i) => (
                <span key={i} className={`badge ${col.type === 'number' ? 'badge-info' : 'badge-success'}`}>
                  {col.name} ({col.type})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Data Preview (First {Math.min(students.data.length, 20)} rows)</div>
          <div className="card-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Age</th><th>Gender</th><th>Study Hrs</th><th>Sleep</th><th>Phone</th><th>Productivity</th><th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.data.slice(0, 20).map((s, i) => (
                    <tr key={i}>
                      <td>{s.studentId}</td><td>{s.age}</td><td>{s.gender}</td>
                      <td>{s.studyHoursPerDay?.toFixed(1)}</td><td>{s.sleepHours?.toFixed(1)}</td>
                      <td>{s.phoneUsageHours?.toFixed(1)}</td>
                      <td>{s.productivityScore?.toFixed(1)}</td><td>{s.finalGrade?.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
