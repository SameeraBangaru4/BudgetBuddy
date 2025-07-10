import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function ShoppingList() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [itemInputs, setItemInputs] = useState({});

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const res = await axios.get(`${API_URL}/shopping-lists/`);
    setLists(res.data);
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await axios.post(`${API_URL}/shopping-lists/`, null, { params: { title: newListTitle } });
    setNewListTitle('');
    fetchLists();
  };

  const handleAddItem = async (listId) => {
    const name = itemInputs[listId]?.name;
    const quantity = itemInputs[listId]?.quantity || 1;
    if (!name || !name.trim()) return;
    await axios.post(`${API_URL}/shopping-lists/${listId}/items`, null, { params: { name, quantity } });
    setItemInputs({ ...itemInputs, [listId]: { name: '', quantity: 1 } });
    fetchLists();
  };

  const handleCheck = async (itemId, checked) => {
    await axios.patch(`${API_URL}/shopping-items/${itemId}/checked`, null, { params: { checked: !checked } });
    fetchLists();
  };

  const handleDeleteItem = async (itemId) => {
    await axios.delete(`${API_URL}/shopping-items/${itemId}`);
    fetchLists();
  };

  const handleDeleteList = async (listId) => {
    await axios.delete(`${API_URL}/shopping-lists/${listId}`);
    fetchLists();
  };

  return (
    <div>
      <h2>Shopping Lists</h2>
      <form onSubmit={handleAddList} style={{ marginBottom: 24 }}>
        <input
          placeholder="New list title"
          value={newListTitle}
          onChange={e => setNewListTitle(e.target.value)}
          style={{ marginRight: 8 }}
          required
        />
        <button type="submit">Add List</button>
      </form>
      {lists.length === 0 && <p>No shopping lists yet.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {lists.map(list => (
          <div key={list.id} style={{ flex: '1 1 300px', minWidth: 280, maxWidth: 350, marginBottom: 32, background: '#eef2ff', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{list.title}</h3>
              <button onClick={() => handleDeleteList(list.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Delete List</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {list.items.map(item => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheck(item.id, item.checked)}
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ textDecoration: item.checked ? 'line-through' : 'none', flex: 1 }}>{item.name} {item.quantity > 1 && <span style={{ color: '#6366f1', marginLeft: 4 }}>x{item.quantity}</span>}</span>
                  <button onClick={() => handleDeleteItem(item.id)} style={{ background: '#eab308', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', marginLeft: 8 }}>Delete</button>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                placeholder="Item name"
                value={itemInputs[list.id]?.name || ''}
                onChange={e => setItemInputs({ ...itemInputs, [list.id]: { ...itemInputs[list.id], name: e.target.value } })}
                style={{ flex: 2 }}
                required
              />
              <input
                type="number"
                min="1"
                value={itemInputs[list.id]?.quantity || 1}
                onChange={e => setItemInputs({ ...itemInputs, [list.id]: { ...itemInputs[list.id], quantity: parseInt(e.target.value) || 1 } })}
                style={{ width: 60 }}
              />
              <button type="button" onClick={() => handleAddItem(list.id)} style={{ background: '#22d3ee', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>Add Item</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShoppingList;
