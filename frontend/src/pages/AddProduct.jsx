import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddProduct = ({ user }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");

  const role = user.role;
  const sellerId = user.id;
  const token = user.token;
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role !== "seller") {
      setMessage("Only sellers can add products");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/products`,
        { name, description, price, stock, sellerId }//,
        //{ headers: { Authorization: `Bearer ${token}` } } = temporory
      );

      setMessage("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
    } catch (err) {
      console.log("Token in AddProduct:", token);
      
      console.log("Sending seller id: ",sellerId);
      console.log("Error adding product:", err.response || err);
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
