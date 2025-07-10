import React, { useState } from 'react';
import './App.css';
import Budget from './Budget';
import ShoppingList from './ShoppingList';
import Reminders from './Reminders';
import BudgetChart from './BudgetChart';

function App() {
  const [page, setPage] = useState('budget');

  return (
    <div className="app-container">
      <h1>Personal Budget Manager</h1>
      <nav>
        <button onClick={() => setPage('budget')}>Budget</button>
        <button onClick={() => setPage('shopping')}>Shopping List</button>
        <button onClick={() => setPage('reminders')}>Reminders</button>
      </nav>
      <div style={{ marginTop: 20 }}>
        {page === 'budget' && <Budget />}
        {page === 'shopping' && <ShoppingList />}
        {page === 'reminders' && <Reminders />}
        {page !== 'budget' && page !== 'shopping' && page !== 'reminders' && (
          <>
            <p>Coming soon...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
