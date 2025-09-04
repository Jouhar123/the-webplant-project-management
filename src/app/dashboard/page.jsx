"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import ProjectForm from "../components/Projectform";
import ProjectCard from "../components/Projectcard";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [addTaskProjectId, setAddTaskProjectId] = useState(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  // ✅ Check token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/login"); // redirect if no token
      } else {
        setToken(storedToken);
      }
    }
  }, [router]);

  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
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
    if (token) fetchProjects();
  }, [token]);

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project and all its tasks?")) return;
    try {
      const res = await fetch(`/api/project?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        if (activeProjectId === id) setActiveProjectId(null);
      }
    } catch {
      alert("Error deleting project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-amber-400 mb-6 text-center">
          Your Projects
        </h1>

        {showForm ? (
          <ProjectForm onAdd={fetchProjects} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            {/* Add Project Button */}
            <div className="flex justify-center mb-4">
              <button
                className="bg-amber-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-amber-500"
                onClick={() => setShowForm(true)}
              >
                Add Project
              </button>
            </div>

            {/* Project List */}
            {loading ? (
              <div className="text-gray-300 text-center">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="text-gray-400 mb-4 text-lg">No projects found.</div>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    activeProjectId={activeProjectId}
                    addTaskProjectId={addTaskProjectId}
                    setActiveProjectId={setActiveProjectId}
                    setAddTaskProjectId={setAddTaskProjectId}
                    onDelete={handleDeleteProject}
                    onUpdate={fetchProjects} // pass update handler
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
