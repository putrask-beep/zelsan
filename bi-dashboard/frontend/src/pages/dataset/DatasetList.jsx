import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, Eye, Database } from 'lucide-react';
import { getDatasets, deleteDataset } from '../../api/dataset.api';

export default function DatasetList() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = async () => {
    try {
      const { data } = await getDatasets();
      setDatasets(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDatasets(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this dataset and all associated data?')) return;
    try {
      await deleteDataset(id);
      fetchDatasets();
    } catch (err) { alert('Failed to delete'); }
  };

  const statusBadge = (status) => {
    const map = { uploaded: 'badge-info', processing: 'badge-warning', ready: 'badge-success', error: 'badge-danger' };
    return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Datasets</h1><div className="subtitle">Manage your datasets</div></div>
        <Link to="/dashboard/datasets/upload" className="btn btn-primary btn-sm">
          <Upload size={14} /> Upload Dataset
        </Link>
      </div>
      <div className="page-body">
        {loading ? <p>Loading...</p> : datasets.length === 0 ? (
          <div className="empty-state">
            <Database size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <h3>No Datasets</h3>
            <p>Upload a CSV file to get started.</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>File</th><th>Rows</th><th>Columns</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {datasets.map((ds) => (
                      <tr key={ds._id}>
                        <td style={{ fontWeight: 600 }}>{ds.name}</td>
                        <td>{ds.originalFilename}</td>
                        <td>{ds.rowCount}</td>
                        <td>{ds.columnCount}</td>
                        <td>{statusBadge(ds.status)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <Link to={`/dashboard/datasets/${ds._id}`} className="btn btn-outline btn-sm"><Eye size={12} /></Link>
                            <button onClick={() => handleDelete(ds._id)} className="btn btn-danger btn-sm"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
