import Task from "@/app/models/task";
import mongoose from "mongoose";
import { verifyJWT } from "@/app/middleware/routemiddleware";
import Project from "@/app/models/project";
import dbConnect from "@/app/DB/dbConnect";

// Create Task (already implemented)
export async function POST(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const { projectId, title, description, status, dueDate } = await req.json();

    await dbConnect();

    const project = await Project.findOne({
      _id: projectId,
      user: decoded.userId,
    });
    if (!project) {
      return new Response(
        JSON.stringify({ error: "Project not found or unauthorized" }),
        { status: 404 }
      );
    }

    const task = new Task({
      project: projectId,
      title,
      description,
      status,
      dueDate,
    });

    await task.save();

    return new Response(JSON.stringify({ message: "Task created", task }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// Get all tasks for a project (with optional status/dueDate filter)
// Get all tasks for a project (with optional status/dueDate filter + sorting)
export async function GET(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");
    const status = url.searchParams.get("status");
    const dueDate = url.searchParams.get("dueDate");
    const sortBy = url.searchParams.get("sortBy") || "dueDate"; // default sort
    const order = url.searchParams.get("order") === "desc" ? -1 : 1; // asc by default

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Ensure project belongs to the logged-in user
    const project = await Project.findOne({
      _id: projectId,
      user: decoded.userId,
    });
    if (!project) {
      return new Response(
        JSON.stringify({ error: "Project not found or unauthorized" }),
        { status: 404 }
      );
    }

    // Build query
    const query = { project: projectId };
    if (status) query.status = status;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    // Fetch tasks with filters and sorting
    const tasks = await Task.find(query).sort({ [sortBy]: order });

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}



// Update a task (expects taskId in body)
export async function PUT(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const { taskId, title, description, status, dueDate } = await req.json();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Find task and ensure user owns the project
    const task = await Task.findById(taskId).populate("project");
    if (!task || String(task.project.user) !== String(decoded.userId)) {
      return new Response(
        JSON.stringify({ error: "Task not found or unauthorized" }),
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return new Response(JSON.stringify({ message: "Task updated", task }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// Delete a task (expects taskId in body)
export async function DELETE(req) {
  const { valid, decoded, error } = await verifyJWT(req);
  if (!valid) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  try {
    const { taskId } = await req.json();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Find task and ensure user owns the project
    const task = await Task.findById(taskId).populate("project");
    if (!task || String(task.project.user) !== String(decoded.userId)) {
      return new Response(
        JSON.stringify({ error: "Task not found or unauthorized" }),
        { status: 404 }
      );
    }

    await task.deleteOne();

    return new Response(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
