"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

export default function LoginPage() {
  const [seatNo, setSeatNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const login = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seatNo, password }),
    });

    const data = await res.json();

    if (data.success) {
      window.open(data.folderUrl, "_blank");
    } else {
      setError(data.message || "Invalid credentials");
    }
  } catch (err) {
    setError("Network error. Try again.");
  } finally {
    setLoading(false); // 🔥 THIS FIXES MOBILE STUCK ISSUE
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Student Portal</h1>

        <input
          style={styles.input}
          placeholder="Seat No (e.g. 002)"
          value={seatNo}
          onChange={(e) => setSeatNo(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login} disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e3f2fd, #f5f7fb)",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    padding: 28,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    color: "#1976d2",
  },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
};
