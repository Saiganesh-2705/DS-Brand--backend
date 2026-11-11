import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add your MongoDB Atlas connection string to the environment.");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error("Check: Atlas > Network Access allows 0.0.0.0/0 (Render has no fixed IP), and the user/password in MONGO_URI are correct.");
    process.exit(1);
  }
};

export default connectDB;
