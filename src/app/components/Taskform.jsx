"use client";

import { useState, useEffect } from "react";

export default function TaskForm({ projectId, token, existingTask, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || "");
      setDescription(existingTask.description || "");
      setStatus(existingTask.status || "todo");
      setDueDate(existingTask.dueDate ? existingTask.dueDate.split("T")[0] : "");
    }
  }, [existingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        existingTask ? `/api/task?id=${existingTask._id}` : "/api/task",
        {
          method: existingTask ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId,
            title,
            description,
            status,
            dueDate,
          }),
        }
      );

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(data.error || "Error saving task");
      }
    } catch (err) {
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-gray-800 p-4 rounded-lg mb-4 max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-bold text-amber-400 mb-4">
        {existingTask ? "Update Task" : "Add Task"}
      </h2>

      {/* Title */}
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Status</label>
        <select
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Due Date */}
      <div className="mb-2">
        <label className="block text-gray-300 mb-1">Due Date</label>
        <input
          type="date"
          className="w-full px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-amber-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-amber-500"
          disabled={loading}
        >
          {loading ? "Saving..." : existingTask ? "Update Task" : "Add Task"}
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
