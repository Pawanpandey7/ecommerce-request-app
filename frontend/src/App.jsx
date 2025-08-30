import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";

import ProductDetail from "./pages/ProductDetail.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CartPage from "./pages/Cart.jsx";
import AddProduct from "./pages/AddProduct.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch {
      return null;
    }
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  });

  // Persist cart and user info
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) localStorage.setItem("userInfo", JSON.stringify(user));
    else localStorage.removeItem("userInfo");
  }, [user]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) return prev.map((p) => p._id === product._id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) =>
    setCartItems((prev) => prev.filter((p) => p._id !== productId));

  // Place order
  const handlePlaceOrder = async (
    shippingAddress = { address: "N/A", city: "", postalCode: "", country: "" }
  ) => {
    if (!user) return alert("Please register/login first.");
    if (cartItems.length === 0) return alert("Cart is empty.");

    const body = {
      user: user._id || user.id,
      orderItems: cartItems.map((it) => ({
        name: it.name,
        qty: it.qty,
        image: it.image || "",
        price: it.price,
        product: it._id,
      })),
      shippingAddress,
      paymentMethod: "Mock",
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: cartItems.reduce((acc, it) => acc + it.qty * (it.price || 0), 0),
    };

    try {
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");
      setCartItems([]);
      localStorage.removeItem("cartItems");
      alert("Order created: " + (data._id || data.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => setUser(null);

  return (
    <div className="app">
      <Navbar cartCount={cartItems.length} user={user} onLogout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home onAdd={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAdd={addToCart} />} />
          <Route path="/register" element={<Register onAuth={setUser} />} />
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route
            path="/cart"
            element={
              <CartPage
                items={cartItems}
                onRemove={removeFromCart}
                onPlaceOrder={handlePlaceOrder}
              />
            }
          />
          
          {/* Only allow sellers to access AddProduct */}
        {/*<Route    
            path="/add-product"
            element={user?.user?.role === "seller" ? <AddProduct user={user} /> : <p>Access denied</p>}
          />*/}
          <Route
          
          path="/add-product"
          element={
            <>
              
              {user?.role === "seller" ? <AddProduct user={user} /> : <p>Access denied</p>}
            </>
          }
        />
          

        </Routes>

          
         

          
      </main>
    </div>
  );
}
