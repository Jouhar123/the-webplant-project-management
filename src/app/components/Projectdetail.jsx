"use client";

import { useEffect, useState } from "react";
import TaskForm from "../components/Taskform";

export default function ProjectDetail({ project }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/tasks?projectId=${project._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) fetchTasks();
  }, [project]);

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ taskId }),
    });

    if (res.ok) {
      setTasks(tasks.filter((t) => t._id !== taskId));
    }
  };

  const handleToggleTask = async (task) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        taskId: task._id,
        status: task.status === "done" ? "todo" : "done",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setTasks(tasks.map((t) => (t._id === task._id ? data.task : t)));
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-amber-400">
          {project.title} – Tasks
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-3 py-1 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-3 bg-gray-900 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-400">{task.description}</p>
                <p className="text-xs text-gray-500">
                  {task.status} |{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <TaskForm
          projectId={project._id}
          onTaskAdded={(t) => setTasks([...tasks, t])}
        />
      )}
    </div>
  );
}
