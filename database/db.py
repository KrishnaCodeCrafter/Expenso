import sqlite3
import os
from werkzeug.security import generate_password_hash
from datetime import date, timedelta

# Database file path
DB_PATH = 'expense_tracker.db'

def get_db():
    """Get database connection with row_factory and foreign keys enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_db():
    """Initialize database tables."""
    conn = get_db()
    try:
        # Create users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        ''')
        # Create expenses table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                date TEXT NOT NULL,
                description TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.commit()
    finally:
        conn.close()

def seed_db():
    """Seed database with sample data."""
    conn = get_db()
    try:
        # Check if users exist
        cursor = conn.execute('SELECT id FROM users LIMIT 1')
        if cursor.fetchone():
            return

        # Insert demo user
        password_hash = generate_password_hash('demo123')
        cursor = conn.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            ('Demo User', 'demo@expenso.com', password_hash)
        )
        user_id = cursor.lastrowid
        conn.commit()

        # Insert 8 sample expenses
        categories = ['Food', 'Transport', 'Bills', 'Health', 'Entertainment', 'Shopping', 'Other', 'Food']
        expenses = []
        today = date.today()

        for i, category in enumerate(categories):
            expense_date = (today - timedelta(days=i)).isoformat()
            expenses.append((user_id, 10.0 * (i + 1), category, expense_date, f'Sample expense {i+1}'))

        conn.executemany('''
            INSERT INTO expenses (user_id, amount, category, date, description)
            VALUES (?, ?, ?, ?, ?)
        ''', expenses)
        conn.commit()
    finally:
        conn.close()

def create_user(name: str, email: str, password: str):
    """Create a new user. Returns (success: bool, error_message: str | None)."""
    password_hash = generate_password_hash(password)
    conn = get_db()
    try:
        conn.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            (name, email, password_hash)
        )
        conn.commit()
        return True, None
    except sqlite3.IntegrityError as e:
        if 'UNIQUE constraint failed: users.email' in str(e):
            return False, 'An account with this email already exists.'
        return False, 'A database error occurred.'
    finally:
        conn.close()