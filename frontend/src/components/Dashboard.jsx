import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, Lock, Wifi, Printer } from 'lucide-react';

const generateData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    name: i,
    cpu: Math.floor(Math.random() * 50) + 10,
  }));

const Dashboard = () => {

  const [chartData, setChartData] = useState(generateData());
  const [anomalyScore, setAnomalyScore] = useState(12);
  const [netConns, setNetConns] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateData());
      setAnomalyScore(prev => Math.min(99, Math.max(5, prev + (Math.random() > 0.5 ? 5 : -5))));
      setNetConns(prev => Math.max(10, prev + (Math.random() > 0.5 ? 3 : -3)));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadDetector = () => {
    const token = localStorage.getItem("detector_token");

    if (!token) {
      alert("Detector token missing. Please login again.");
      return;
    }

    window.location.href =
      `http://127.0.0.1:5000/api/detector-download?token=${token}`;
  };

  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="dashboard-wrapper">

      {/* TOP RIGHT BUTTONS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>

        <button
          onClick={handleDownloadDetector}
          style={{
            background: 'rgba(0,124,195,0.15)',
            border: '1px solid rgba(0,124,195,0.4)',
            color: '#007CC3',
            padding: '6px 14px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ⬇ Download Detector
        </button>

        <button
          onClick={generatePDF}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#cbd5e1',
            padding: '6px 14px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          <Printer size={16} /> Generate Report
        </button>

      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <Activity size={24} />
          <div>
            <h4>Anomaly Score</h4>
            <p>{anomalyScore}%</p>
          </div>
        </div>

        <div className="stat-card">
          <ShieldAlert size={24} />
          <div>
            <h4>Threat Level</h4>
            <p>{anomalyScore > 70 ? 'HIGH' : anomalyScore > 40 ? 'MEDIUM' : 'LOW'}</p>
          </div>
        </div>

        <div className="stat-card">
          <Lock size={24} />
          <div>
            <h4>Files Protected</h4>
            <p>{Math.floor(anomalyScore / 10)}</p>
          </div>
        </div>

        <div className="stat-card">
          <Wifi size={24} />
          <div>
            <h4>Active Connections</h4>
            <p>{netConns}</p>
          </div>
        </div>

      </div>

      {/* CHART */}
      <div className="chart-container" style={{ marginTop: 30 }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#007CC3"
              fill="#007CC3"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;