import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://127.0.0.1:8000';

function BarChart({ onClose }) {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    const res = await axios.get(`${API_URL}/transactions/`);
    const transactions = res.data;
    const categoryTotals = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });
    setData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryTotals),
          backgroundColor: '#6366f1',
        },
      ],
    });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, margin: '24px 0', boxShadow: '0 2px 8px rgba(60,72,120,0.09)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#6366f1' }}>Expenses by Category (Bar Graph)</h3>
        <button onClick={onClose} style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>Close</button>
      </div>
      <Bar data={data} />
    </div>
  );
}

export default BarChart;
