import mongoose from "mongoose";

// Uploaded photos live in MongoDB so they survive Render redeploys/restarts
// (Render's disk is ephemeral). Free Atlas tier (512 MB) holds hundreds of
// compressed photos.
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    size: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
