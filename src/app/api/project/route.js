import Project from "@/app/models/project";
import mongoose from "mongoose";
import { verifyJWT } from "@/app/middleware/routemiddleware";

export async function POST(req) {
  // Verify JWT
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const { title, description } = await req.json();

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const project = new Project({
      user: decoded.userId,
      title,
      description,
    });

    await project.save();

    return new Response(JSON.stringify({ message: "Project created", project }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const projects = await Project.find({ user: decoded.userId }).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ projects }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// UPDATE Project
export async function PUT(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const { id, title, description } = await req.json();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const project = await Project.findOneAndUpdate(
      { _id: id, user: decoded.userId },
      { title, description },
      { new: true }
    );
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found or unauthorized" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Project updated", project }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE Project
export async function DELETE(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const project = await Project.findOneAndDelete({ _id: id, user: decoded.userId });
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found or unauthorized" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Project deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}