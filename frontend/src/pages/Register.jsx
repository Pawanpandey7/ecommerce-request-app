import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register({ onAuth }) {
  const [form,setForm] = useState({ name:"", email:"", password:"", role:"customer" });
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      onAuth(data.user || data);
      nav("/");
    } catch(err) {
      setMsg(err.message);
    } finally { setLoading(false); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
      <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
      <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
        <option value="customer">Customer</option>
        <option value="seller">Seller</option>
      </select>
      <button className="btn primary" type="submit" disabled={loading}>{loading ? "..." : "Register"}</button>
      {msg && <div className="error">{msg}</div>}
    </form>
  );
}
