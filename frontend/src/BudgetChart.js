import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://127.0.0.1:8000';

function BudgetChart() {
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
          backgroundColor: [
            '#6366f1', '#f59e42', '#22d3ee', '#ef4444', '#a3e635', '#fef08a', '#f472b6', '#38bdf8', '#34d399', '#f87171', '#facc15', '#a78bfa'
          ],
        },
      ],
    });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, margin: '24px 0', boxShadow: '0 2px 8px rgba(60,72,120,0.09)' }}>
      <h3 style={{ textAlign: 'center', color: '#6366f1' }}>Expenses by Category</h3>
      <Pie data={data} />
    </div>
  );
}

export default BudgetChart;
