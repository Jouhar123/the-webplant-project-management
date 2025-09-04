"use client";

import { useState } from "react";

export default function ProjectForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    const res = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    setLoading(false);
    if (res.ok) {
      setTitle("");
      setDescription("");
      onAdd();
    }
  };

  return (
    <form
      className="bg-gray-800 p-4 rounded-lg mb-4 max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-amber-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-amber-500"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Project"}
        </button>
        <button
          type="button"
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded font-semibold hover:bg-gray-600"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
