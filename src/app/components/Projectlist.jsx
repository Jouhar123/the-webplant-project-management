"use client";

import { useEffect, useState } from "react";
import ProjectDetail from "./ProjectDetail";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  const fetchProjects = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/project", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProjects(data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProject),
    });

    const data = await res.json();
    if (res.ok) {
      setProjects([...projects, data.project]);
      setNewProject({ title: "", description: "" });
      setShowForm(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/project?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProjects(projects.filter((p) => p._id !== id));
      if (activeProject?._id === id) setActiveProject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Project Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-400">Projects</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {/* Add Project Form */}
      {showForm && (
        <form
          onSubmit={handleAddProject}
          className="bg-gray-800 p-4 rounded-lg space-y-3"
        >
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            required
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </form>
      )}

      {/* Project List */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Add one!</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-gray-900 p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-amber-400">
                  {project.title}
                </h2>
                <p className="text-gray-400">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setActiveProject(
                      activeProject?._id === project._id ? null : project
                    )
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {activeProject?._id === project._id ? "Hide" : "View"}
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Active Project Detail */}
      {activeProject && <ProjectDetail project={activeProject} />}
    </div>
  );
}
