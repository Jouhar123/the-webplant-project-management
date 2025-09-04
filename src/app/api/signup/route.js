import User from "@/app/models/users";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
    }

    // Create new user
    const user = new User({ fullName, email, password });
    await user.save();

    // Never return password!
    return new Response(JSON.stringify({ message: "Signup successful", user: { fullName, email } }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}