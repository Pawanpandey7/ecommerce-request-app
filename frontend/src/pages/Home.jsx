import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        console.log("Fetched products:", data); // Log products for debugging
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    if (!product._id) {
      alert("Product ID not found. Cannot add to cart.");
      return;
    }
    onAdd(product);
  };

  if (loading) return <div className="center">Loading products...</div>;
  if (error) return <div className="center error">Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p._id}>
            <div className="card-body">
              <h3>{p.name}</h3>
              <p className="muted">{p.description?.slice(0, 100)}</p>
              <div className="price">Rs {p.price}</div>
            </div>
            <div className="card-actions">
              <Link to={`/product/${p._id}`} state={{ product: p }} className="btn">
                View
              </Link>
              <button
                className="btn primary"
                onClick={() => handleAddToCart(p)}
                disabled={p.stock <= 0}
              >
                {p.stock > 0 ? "Add to cart" : "Out of stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
