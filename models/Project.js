import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Interior", "Roofing", "Commercial", "Residential"],
    },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    year: { type: Number },
    area: { type: String },
    client: { type: String },
    featured: { type: Boolean, default: false },
    // Drives the tab filter on the Projects page (Interior / Roofing / Ongoing / Completed)
    stage: {
      type: String,
      enum: ["Interior", "Roofing", "Ongoing", "Completed"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
