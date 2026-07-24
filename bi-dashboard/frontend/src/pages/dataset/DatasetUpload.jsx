import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { uploadDataset } from '../../api/dataset.api';

export default function DatasetUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadDataset(formData);
      navigate('/dashboard/datasets');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Upload Dataset</h1><div className="subtitle">Import CSV, Excel, or JSON data</div></div>
      </div>
      <div className="page-body">
        <div className="card">
          <div className="card-body">
            <div
              className={`upload-zone ${dragOver ? 'dragover' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.json" style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])} />
              {file ? (
                <div>
                  <FileText size={32} color="#2563eb" />
                  <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>{file.name}</p>
                  <p>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <Upload size={32} color="#94a3b8" />
                  <p>Drag & drop a file here, or click to browse</p>
                  <p>Supports CSV, Excel, JSON (max 50MB)</p>
                </div>
              )}
            </div>
            {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading & Processing...' : 'Upload & Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
