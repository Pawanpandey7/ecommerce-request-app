import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  // Load cart from localStorage or start with empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const user = JSON.parse(localStorage.getItem("user")); // Logged-in user

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  // Place order function
  const placeOrder = async () => {
    if (!user) {
      alert("Please login to place an order");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderData = {
      user: user._id,
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: {
        address: "123 Street",
        city: "Kathmandu",
        postalCode: "44600",
        country: "Nepal",
      },
      paymentMethod: "PayPal",
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
    };

    try {
      const { data } = await axios.post("http://localhost:5000/api/orders", orderData);
      console.log("Order placed:", data);
      alert("Order placed successfully!");
      setCartItems([]); // Clear cart after order
      localStorage.removeItem("cart");
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Check console for details.");
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <img src={item.image} alt={item.name} width={50} />
                <span>{item.name}</span>
                <span>Qty: {item.qty}</span>
                <span>Price: ${item.price}</span>
                <button onClick={() => removeItem(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>
            Total: $
            {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}
          </h3>
          <button onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
};

export default Cart;
