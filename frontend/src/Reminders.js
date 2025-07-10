import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_URL}/reminders/`);
      setReminders(res.data);
    } catch {}
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reminders/`, form);
      setForm({ title: '', date: '', time: '' });
      fetchReminders();
    } catch {}
    setLoading(false);
  };

  const handleDelete = async id => {
    await axios.delete(`${API_URL}/reminders/${id}`);
    fetchReminders();
  };

  return (
    <div>
      <h2>Reminders</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="time" type="time" value={form.time} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
      </form>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {reminders.map(r => (
          <li key={r.id} style={{ background: '#fef9c3', borderRadius: 8, padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>{r.title}</strong> - {r.date} {r.time}
            </span>
            <button onClick={() => handleDelete(r.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reminders;
