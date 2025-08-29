import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function Cart({ items, onRemove, onPlaceOrder }) {
  const total = useMemo(() => items.reduce((s, it) => s + (it.qty * (it.price || 0)), 0), [items]);

  return (
    <div>
      <h2>Your cart</h2>
      {items.length === 0 ? (
        <div>
          Cart is empty. <Link to="/">Shop</Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map(it => (
              <li key={it._id} className="cart-item">
                <div>
                  <strong>{it.name}</strong>
                  <div className="muted">Rs {it.price} x {it.qty}</div>
                </div>
                <div>
                  <button className="btn" onClick={() => onRemove(it._id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <div>Total: Rs {total.toFixed(2)}</div>
            <button className="btn primary" onClick={() => onPlaceOrder()}>Place order (mock)</button>
          </div>
        </>
      )}
    </div>
  );
}
