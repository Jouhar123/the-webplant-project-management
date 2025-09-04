"use client";

import { useState, useEffect } from "react";
import TaskForm from "./Taskform";

export default function TaskList({ projectId, token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // "" means all
  const [dueDateFilter, setDueDateFilter] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ projectId });
      if (statusFilter) queryParams.append("status", statusFilter);
      if (dueDateFilter) queryParams.append("dueDate", dueDateFilter);

      const res = await fetch(`/api/task?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setTasks(data.tasks || []);
      else setTasks([]);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && token) fetchTasks();
  }, [projectId, token, statusFilter, dueDateFilter]);

  const handleDeleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/task?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-amber-400 mb-2">Tasks</h3>

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Status Filter */}
        <select
          className="px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="todo">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Due Date Filter */}
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
        />

        <button
          onClick={() => {
            setStatusFilter("");
            setDueDateFilter("");
          }}
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>

      {/* 🔹 Task List */}
      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-900 p-3 rounded"
            >
              <div>
                <p className="text-gray-200 font-semibold">{task.title}</p>
                <p className="text-gray-400 text-sm">{task.description}</p>
                <p className="text-xs text-gray-500">
                  Status: {task.status} | Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditTask(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 Task Form for Update */}
      {editTask && (
        <div className="mt-4">
          <TaskForm
            projectId={projectId}
            token={token}
            existingTask={editTask}
            onSuccess={() => {
              setEditTask(null);
              fetchTasks();
            }}
            onCancel={() => setEditTask(null)}
          />
        </div>
      )}
    </div>
  );
}
