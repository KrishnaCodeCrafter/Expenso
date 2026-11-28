"""Tests for the registration feature."""
import pytest
import sqlite3
import os
import tempfile
from werkzeug.security import check_password_hash

# Import the app and database functions
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database.db import create_user, get_db, init_db, DB_PATH


@pytest.fixture
def client():
    """Create a test client for the app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def test_db():
    """Create a temporary database for testing."""
    # Use a temporary database file
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    os.close(db_fd)

    # Override DB_PATH for testing
    import database.db
    original_db_path = database.db.DB_PATH
    database.db.DB_PATH = db_path

    # Initialize the test database
    init_db()

    yield db_path

    # Cleanup
    database.db.DB_PATH = original_db_path
    if os.path.exists(db_path):
        os.unlink(db_path)


def test_register_success(client, test_db):
    """Test successful registration creates user and redirects to login."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    }, follow_redirects=False)

    # Check redirect to login with registered=1
    assert response.status_code == 302
    assert '/login?registered=1' in response.location

    # Verify user exists in database with hashed password
    conn = sqlite3.connect(test_db)
    conn.row_factory = sqlite3.Row
    cursor = conn.execute('SELECT * FROM users WHERE email = ?', ('test@example.com',))
    user = cursor.fetchone()
    conn.close()

    assert user is not None
    assert user['name'] == 'Test User'
    assert user['email'] == 'test@example.com'
    assert check_password_hash(user['password_hash'], 'password123')
    assert user['password_hash'] != 'password123'  # Password is hashed, not plaintext


def test_register_duplicate_email(client, test_db):
    """Test registering with duplicate email returns error."""
    # First registration
    client.post('/register', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    })

    # Second registration with same email
    response = client.post('/register', data={
        'name': 'Another User',
        'email': 'test@example.com',
        'password': 'different123'
    })

    assert response.status_code == 200
    assert b'An account with this email already exists' in response.data


def test_register_missing_name(client, test_db):
    """Test registration with missing name returns error."""
    response = client.post('/register', data={
        'name': '',
        'email': 'test@example.com',
        'password': 'password123'
    })

    assert response.status_code == 200
    assert b'Full name is required' in response.data


def test_register_missing_email(client, test_db):
    """Test registration with missing email returns error."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': '',
        'password': 'password123'
    })

    assert response.status_code == 200
    assert b'valid email address' in response.data


def test_register_missing_password(client, test_db):
    """Test registration with missing password returns error."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': ''
    })

    assert response.status_code == 200
    assert b'Password is required' in response.data


def test_register_short_password(client, test_db):
    """Test registration with password < 8 chars returns error."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'short'
    })

    assert response.status_code == 200
    assert b'at least 8 characters' in response.data


def test_register_invalid_email(client, test_db):
    """Test registration with invalid email format returns error."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': 'not-an-email',
        'password': 'password123'
    })

    assert response.status_code == 200
    assert b'valid email address' in response.data


def test_register_whitespace_normalization(client, test_db):
    """Test that email with leading/trailing spaces is trimmed and lowercased."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': '  TEST@EXAMPLE.COM  ',
        'password': 'password123'
    }, follow_redirects=False)

    assert response.status_code == 302
    assert '/login?registered=1' in response.location

    # Verify email was normalized in database
    conn = sqlite3.connect(test_db)
    conn.row_factory = sqlite3.Row
    cursor = conn.execute('SELECT email FROM users WHERE email = ?', ('test@example.com',))
    user = cursor.fetchone()
    conn.close()

    assert user is not None
    assert user['email'] == 'test@example.com'


def test_register_password_not_plaintext(client, test_db):
    """Test that password is hashed, not stored in plaintext."""
    response = client.post('/register', data={
        'name': 'Test User',
        'email': 'test2@example.com',
        'password': 'mysecretpassword'
    }, follow_redirects=False)

    assert response.status_code == 302

    conn = sqlite3.connect(test_db)
    conn.row_factory = sqlite3.Row
    cursor = conn.execute('SELECT password_hash FROM users WHERE email = ?', ('test2@example.com',))
    user = cursor.fetchone()
    conn.close()

    assert user is not None
    # Password should be hashed, not plaintext
    assert user['password_hash'] != 'mysecretpassword'
    # Should be a valid werkzeug hash
    assert check_password_hash(user['password_hash'], 'mysecretpassword')


def test_register_get_returns_form(client):
    """Test GET /register returns the registration form."""
    response = client.get('/register')
    assert response.status_code == 200
    assert b'Create your account' in response.data
    assert b'Full name' in response.data
    assert b'Email address' in response.data
    assert b'Password' in response.data


def test_login_shows_success_message(client):
    """Test /login?registered=1 shows success message."""
    response = client.get('/login?registered=1')
    assert response.status_code == 200
    assert b'Account created successfully' in response.data


def test_logged_in_user_redirected_from_login_and_register(client):
    """Test logged in user is redirected from login and register pages to profile."""
    with client.session_transaction() as sess:
        sess['user_id'] = 1

    res_login = client.get('/login')
    assert res_login.status_code == 302
    assert '/profile' in res_login.location

    res_register = client.get('/register')
    assert res_register.status_code == 302
    assert '/profile' in res_register.location


if __name__ == '__main__':
    pytest.main([__file__, '-v'])