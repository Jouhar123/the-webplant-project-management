"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Loginpage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Email, password: Password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        // Optionally store the token here
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        className="w-full max-w-md bg-gray-900/90 shadow-2xl rounded-2xl px-10 py-8 flex flex-col gap-5 border border-gray-800"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">Login</h1>
        <label className="text-sm font-semibold text-gray-300">Email</label>
        <input
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          placeholder="Enter your email"
          required
        />
        <label className="text-sm font-semibold text-gray-300">Password</label>
        <input
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          placeholder="Enter your password"
          required
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2 rounded-lg shadow transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && <div className="text-green-400 text-center">{message}</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-amber-400 hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Loginpage;