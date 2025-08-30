import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ cartCount, user, onLogout }) {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <Link to="/" className="brand">E-Request</Link>
        <nav className="links">
          {user ? (
            <>
              <span className="greet">Hi, {user.name}</span>

              {/* Show Cart only for buyers */}
              {user.role === "customer" && (
                <Link to="/cart">Cart ({cartCount})</Link>
              )}

              {/* Show Add Product only for sellers */}
              {user.role === "seller" && (
                <Link to="/add-product" className="btn">
                  Add Product
                </Link>
              )}

              <button onClick={onLogout} className="btn-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
