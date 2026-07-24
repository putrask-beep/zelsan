import { Link } from 'react-router-dom';
import { BarChart3, BarChart, Brain, PieChart, Database, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="logo">
          <BarChart3 />
          <span>BI Dashboard</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <Link to="/dashboard" className="btn-login">Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-login">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <h1>
          Student <span>Productivity</span> & <span>Distraction</span> Analysis
        </h1>
        <p>
          Business Intelligence dashboard untuk menganalisis pola produktivitas dan
          distraksi mahasiswa. Temukan insight, jalankan clustering, dan buat laporan
          komprehensif.
        </p>
        <div className="hero-actions">
          <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary">
            Get Started
          </Link>
          <a href="#features" className="btn btn-outline">
            Learn More
          </a>
        </div>
      </section>

      <section className="landing-features" id="features">
        <h2>Fitur Utama</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon"><BarChart size={20} /></div>
            <h3>BI Analysis</h3>
            <p>Analisis data komprehensif dengan KPI, korelasi, dan distribusi untuk insight mendalam.</p>
          </div>
          <div className="feature-card">
            <div className="icon"><Database size={20} /></div>
            <h3>Integration Services</h3>
            <p>Import dataset CSV, cleaning data otomatis, dan transformasi ke format yang siap dianalisis.</p>
          </div>
          <div className="feature-card">
            <div className="icon"><Brain size={20} /></div>
            <h3>Data Mining</h3>
            <p>Ekstraksi pola dan insight menggunakan statistical analysis dan correlation matrix.</p>
          </div>
          <div className="feature-card">
            <div className="icon"><Target size={20} /></div>
            <h3>Clustering</h3>
            <p>K-Means clustering untuk mengelompokkan mahasiswa berdasarkan karakteristik produktivitas.</p>
          </div>
          <div className="feature-card">
            <div className="icon"><PieChart size={20} /></div>
            <h3>Reporting</h3>
            <p>Generate laporan PDF dan Excel dengan summary, statistik, dan insights lengkap.</p>
          </div>
          <div className="feature-card">
            <div className="icon"><BarChart size={20} /></div>
            <h3>Dashboard</h3>
            <p>Visualisasi data interaktif dengan chart modern untuk overview yang komprehensif.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
