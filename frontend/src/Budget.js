import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

const API_URL = 'http://127.0.0.1:8000';

function Budget() {
  const [showBarChart, setShowBarChart] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [form, setForm] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'expense',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get(`${API_URL}/transactions/`);
    setTransactions(res.data);
  };

  const fetchSummary = async () => {
    const res = await axios.get(`${API_URL}/budget/summary`);
    setSummary(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/transactions/`, {
        ...form,
        amount: parseFloat(form.amount),
      });
      setForm({ date: '', amount: '', category: '', description: '', type: 'expense' });
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      alert('Failed to add transaction');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Budget Manager</h2>
      <button onClick={() => setShowBarChart(s => !s)} style={{marginBottom: 16, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer'}}>
        {showBarChart ? 'Hide Spending Bar Graph' : 'Show Spending Bar Graph'}
      </button>
      {showBarChart && <BarChart onClose={() => setShowBarChart(false)} />}
      <div className="summary-box">
        <span><strong>Income:</strong> ${summary.total_income.toFixed(2)}</span>
        <span><strong>Expense:</strong> ${summary.total_expense.toFixed(2)}</span>
        <span><strong>Balance:</strong> ${summary.balance.toFixed(2)}</span>
      </div>
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
      </form>
      <h3>Transactions</h3>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>{tx.category}</td>
              <td>{tx.description}</td>
              <td className={tx.type === 'income' ? 'income' : 'expense'}>
                {tx.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Budget;
