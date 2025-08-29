import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login({ onAuth }) {
  const [form,setForm] = useState({ email:"", password:"" });
  const [msg,setMsg] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      onAuth(data.user || data);
      nav("/");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
      <button className="btn primary" type="submit">Login</button>
      {msg && <div className="error">{msg}</div>}
    </form>
  );
}
