import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductDetail({ onAdd }) {
  const { id } = useParams();
  const loc = useLocation();
  const productFromState = loc.state && loc.state.product;
  const [product,setProduct] = useState(productFromState || null);
  const [loading,setLoading] = useState(!product);
  const [error,setError] = useState(null);

  useEffect(() => {
    if (product) return;
    (async ()=> {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const list = await res.json();
        const found = list.find(p => p._id === id);
        if (!found) throw new Error("Product not found");
        setProduct(found);
      } catch(err) {
        setError(err.message);
      } finally { setLoading(false); }
    })();
  },[id,product]);

  if (loading) return <div className="center">Loading product...</div>;
  if (error) return <div className="center error">{error}</div>;
  if (!product) return <div className="center">Product not found</div>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <div className="price">Rs {product.price}</div>
      <div style={{marginTop:12}}>
        <button className="btn primary" onClick={() => onAdd(product)}>Add to cart</button>
      </div>
    </div>
  );
}
