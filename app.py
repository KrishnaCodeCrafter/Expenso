from flask import Flask, render_template, request, redirect, url_for
import os
from database.db import init_db, seed_db, create_user

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-for-expenso')

# Initialize database on startup
with app.app_context():
    init_db()
    seed_db()


# ------------------------------------------------------------------ #
# Routes                                                              #
# ------------------------------------------------------------------ #

@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")

    # POST request
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")
    confirm_password = request.form.get("confirm_password", "")

    # Basic validation
    if not name:
        return render_template("register.html", error="Full name is required.")
    if not email or "@" not in email:
        return render_template("register.html", error="Please enter a valid email address.")
    if not password:
        return render_template("register.html", error="Password is required.")
    if len(password) < 8:
        return render_template("register.html", error="Password must be at least 8 characters.")
    if password != confirm_password:
        return render_template("register.html", error="Passwords do not match.")

    success, error = create_user(name, email, password)
    if success:
        return redirect(url_for("login", registered=1))
    return render_template("register.html", error=error)


@app.route("/login")
def login():
    registered = request.args.get("registered") == "1"
    return render_template("login.html", registered=registered)


@app.route("/terms")
def terms():
    return render_template("terms.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


# ------------------------------------------------------------------ #
# Placeholder routes — students will implement these                  #
# ------------------------------------------------------------------ #

@app.route("/logout")
def logout():
    return "Logout — coming in Step 3"


@app.route("/profile")
def profile():
    return "Profile page — coming in Step 4"


@app.route("/expenses/add")
def add_expense():
    return "Add expense — coming in Step 7"


@app.route("/expenses/<int:id>/edit")
def edit_expense(id):
    return "Edit expense — coming in Step 8"


@app.route("/expenses/<int:id>/delete")
def delete_expense(id):
    return "Delete expense — coming in Step 9"


if __name__ == "__main__":
    app.run(debug=True, port=5001)