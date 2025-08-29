import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ cartCount, user, onLogout }) {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <Link to="/" className="brand">E-Request</Link>
        <nav className="links">
          <Link to="/cart">Cart ({cartCount})</Link>
          {!user ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <span className="greet">Hi, {user.name}</span>
              <button onClick={onLogout} className="btn-link">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
