import sqlite3
from typing import List, Optional
from models import Transaction
from datetime import date

def get_db_connection():
    conn = sqlite3.connect('budget.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS shopping_lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS shopping_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            checked INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    conn.close()

def add_transaction(transaction: Transaction) -> int:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO transactions (date, amount, category, description, type)
        VALUES (?, ?, ?, ?, ?)
    ''', (transaction.date.isoformat(), transaction.amount, transaction.category, transaction.description, transaction.type))
    conn.commit()
    transaction_id = cur.lastrowid
    conn.close()
    return transaction_id

def get_transactions() -> List[Transaction]:
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM transactions ORDER BY date DESC').fetchall()
    conn.close()
    return [Transaction(**dict(row)) for row in rows]

def get_budget_summary():
    conn = get_db_connection()
    income = conn.execute("SELECT SUM(amount) FROM transactions WHERE type='income'").fetchone()[0] or 0.0
    expense = conn.execute("SELECT SUM(amount) FROM transactions WHERE type='expense'").fetchone()[0] or 0.0
    balance = income - expense
    conn.close()
    return {'total_income': income, 'total_expense': expense, 'balance': balance}

# --- Shopping List Functions ---
def create_shopping_list(title: str) -> int:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO shopping_lists (title) VALUES (?)', (title,))
    conn.commit()
    list_id = cur.lastrowid
    conn.close()
    return list_id

# --- Reminders Functions ---
def create_reminders_table():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_reminder(title: str, date: str, time: str) -> int:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO reminders (title, date, time) VALUES (?, ?, ?)', (title, date, time))
    conn.commit()
    reminder_id = cur.lastrowid
    conn.close()
    return reminder_id

def get_reminders():
    conn = get_db_connection()
    reminders = conn.execute('SELECT * FROM reminders ORDER BY date, time').fetchall()
    conn.close()
    return [dict(r) for r in reminders]

def delete_reminder(reminder_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM reminders WHERE id=?', (reminder_id,))
    conn.commit()
    conn.close()

def get_shopping_lists():
    conn = get_db_connection()
    lists = conn.execute('SELECT * FROM shopping_lists').fetchall()
    result = []
    for l in lists:
        items = conn.execute('SELECT * FROM shopping_items WHERE list_id=?', (l['id'],)).fetchall()
        result.append({
            'id': l['id'],
            'title': l['title'],
            'items': [dict(item) for item in items]
        })
    conn.close()
    return result

def add_item_to_list(list_id: int, name: str, quantity: int = 1) -> int:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO shopping_items (list_id, name, quantity, checked) VALUES (?, ?, ?, 0)', (list_id, name, quantity))
    conn.commit()
    item_id = cur.lastrowid
    conn.close()
    return item_id

def update_item_checked(item_id: int, checked: bool):
    conn = get_db_connection()
    conn.execute('UPDATE shopping_items SET checked=? WHERE id=?', (1 if checked else 0, item_id))
    conn.commit()
    conn.close()

def delete_item(item_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM shopping_items WHERE id=?', (item_id,))
    conn.commit()
    conn.close()

def delete_shopping_list(list_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM shopping_lists WHERE id=?', (list_id,))
    conn.commit()
    conn.close()
