"use client";

import { useState } from "react";
import TaskList from "./Tasklist";
import TaskForm from "./Taskform";

export default function ProjectCard({
  project,
  activeProjectId,
  setActiveProjectId,
  addTaskProjectId,
  setAddTaskProjectId,
  onDelete,
  onUpdate, // ✅ add handler for updating project
}) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDescription, setEditDescription] = useState(project.description);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // ✅ handle project update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/project", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: project._id,
          title: editTitle,
          description: editDescription,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdate && onUpdate(data.project); // ✅ notify parent to refresh/update
        setIsEditing(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update project");
      }
    } catch (err) {
      alert("Error updating project");
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow p-4">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex-1 mr-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2 py-1 mb-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-2 py-1 mb-2 rounded bg-gray-800 text-white border border-gray-700"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-amber-400">{project.title}</h2>
            <p className="text-gray-400">{project.description}</p>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() =>
                setActiveProjectId(
                  activeProjectId === project._id ? null : project._id
                )
              }
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              {activeProjectId === project._id ? "Hide Tasks" : "View Tasks"}
            </button>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-amber-500 text-white px-3 py-1 rounded"
            >
              {showAddTask ? "Cancel" : "Add Task"}
            </button>
          </div>
        )}
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="mt-4 bg-gray-800 rounded p-3">
          <TaskForm
            projectId={project._id}
            token={token}
            onSuccess={() => setShowAddTask(false)}
            onCancel={() => setShowAddTask(false)}
          />
        </div>
      )}

      {/* Task List */}
      {activeProjectId === project._id && !showAddTask && (
        <div className="mt-4 bg-gray-800 rounded p-3">
          <TaskList projectId={project._id} token={token} />
        </div>
      )}
    </div>
  );
}
