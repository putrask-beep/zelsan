import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/dashboard/Overview';
import ActivityAnalysis from './pages/dashboard/ActivityAnalysis';
import FocusAnalysis from './pages/dashboard/FocusAnalysis';
import EnergyAnalysis from './pages/dashboard/EnergyAnalysis';
import KPIDashboard from './pages/dashboard/KPIDashboard';
import CorrelationView from './pages/dashboard/CorrelationView';
import DatasetList from './pages/dataset/DatasetList';
import DatasetUpload from './pages/dataset/DatasetUpload';
import DatasetDetail from './pages/dataset/DatasetDetail';
import BIAnalysis from './pages/analysis/BIAnalysis';
import DataMining from './pages/mining/DataMining';
import ClusteringView from './pages/clustering/ClusteringView';
import Reporting from './pages/reporting/Reporting';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="activity" element={<ActivityAnalysis />} />
            <Route path="focus" element={<FocusAnalysis />} />
            <Route path="energy" element={<EnergyAnalysis />} />
            <Route path="kpis" element={<KPIDashboard />} />
            <Route path="correlations" element={<CorrelationView />} />
            <Route path="datasets" element={<DatasetList />} />
            <Route path="datasets/upload" element={<DatasetUpload />} />
            <Route path="datasets/:id" element={<DatasetDetail />} />
            <Route path="analysis" element={<BIAnalysis />} />
            <Route path="mining" element={<DataMining />} />
            <Route path="clustering" element={<ClusteringView />} />
            <Route path="reporting" element={<Reporting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
