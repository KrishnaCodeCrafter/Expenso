# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Expense Tracker (Expenso)** - A Flask-based personal finance expense tracking application with a modern, responsive UI featuring light/dark mode theming.

## Development Setup

```bash
# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate  # Windows

# Install dependencies (should already be installed in .venv)
pip install -r requirements.txt

# Run the development server
python app.py

# Server runs on http://localhost:5001
```

## Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_file.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=app
```

## Project Structure

```
expense-tracker/
├── app.py              # Flask application with routes
├── database/
│   ├── db.py           # Database setup (SQLite/SQLAlchemy)
│   └── __init__.py
├── static/
│   ├── css/
│   │   └── style.css   # All styling with CSS custom properties
│   └── js/
│       └── main.js     # Theme management and interactivity
├── templates/
│   ├── base.html       # Base template with theme system
│   ├── landing.html    # Home page with hero section
│   ├── login.html      # Sign-in page
│   ├── register.html   # Registration page
│   ├── terms.html      # Terms and conditions
│   ├── privacy.html    # Privacy policy
│   ├── _header.html    # Navigation bar component
│   ├── _footer.html    # Footer component
│   └── _theme_toggle.html  # Dark/light mode toggle button
├── requirements.txt    # Python dependencies
└── .gitignore
```

## Architecture & Design System

### Theme System (Dark/Light Mode)

The application uses a CSS custom properties approach with a `data-theme` attribute on the `<html>` element:

**Default Theme**: Dark mode is the default on first visit

**Theme Variables**:
- **Light Mode**: Located in `:root` - uses warm grayscale and teal (#0d9488) accent palette
- **Dark Mode**: Located in `[data-theme="dark"]` - uses cream/beige text on midnight black backgrounds with vibrant teal accents

**Key Theme Colors**:
- `--ink`: Primary text color
- `--paper`: Page background
- `--accent`: Primary brand color (teal)
- `--accent-2`: Secondary accent (amber/gold)
- `--danger`: Error state (red)
- `--success`: Success state (teal)

### Theme Toggle Implementation

Theme is managed via `main.js` ThemeManager:
- Persists preference in `localStorage` under key `theme`
- Uses `data-theme` attribute for CSS scoping
- Smooth CSS transitions coordinated with theme class

Logo/Brand Visibility:
- `.logo-light`, `.name-light` - visible only in light mode
- `.logo-dark`, `.name-dark` - visible only in dark mode

### File Organization

- **Templates**: Use Jinja2 inheritance (`base.html`)
- **Static Assets**: CSS variables follow consistent naming (`--variable-name`)
- **Component Pattern**: Header/footer included as partials (`_header.html`, `_footer.html`)

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/register` | Account registration |
| `/login` | User sign-in |
| `/terms` | Terms and conditions |
| `/privacy` | Privacy policy |
| `/logout` | Placeholder |
| `/profile` | Placeholder |
| `/expenses/add` | Placeholder |
| `/expenses/<id>/edit` | Placeholder |
| `/expenses/<id>/delete` | Placeholder |

## Frontend Guidelines

1. **Brand Images**: Use consistent naming conventions:
   - `Dark mode brand logo.png` / `Light mode brand logo.png`
   - `Dark mode Brand name.png` / `Light mode Brand name.png`

2. **CSS Structure**: Variables first, then reset, then components

3. **Accessibility**: Theme toggle has `aria-label`, `aria-pressed`, and keyboard support

4. **Responsive**: Mobile-first with breakpoints at 900px and 600px