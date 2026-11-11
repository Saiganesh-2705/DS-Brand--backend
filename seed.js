// Optional: loads SAMPLE projects so the Projects page isn't empty on day one.
//   npm run seed          -> only seeds if there are no projects yet
//   npm run seed -- --force -> wipes projects and re-seeds
// Replace these with real DS Brand work from the Admin dashboard (they use stock photos).
// The admin user is created automatically on server start from ADMIN_EMAIL / ADMIN_PASSWORD.
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Project from "./models/Project.js";
import ensureAdmin from "./utils/ensureAdmin.js";

dotenv.config();
await connectDB();

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;
const force = process.argv.includes("--force");

const samples = [
  { title: "Modern 3BHK Home Interior", location: "Kanchipuram", category: "Interior", stage: "Interior", year: 2025, area: "1,450 sq ft", featured: true,
    description: "Full-home interior: false ceiling with cove lighting, TV unit, wardrobes in every bedroom and a modular kitchen. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1600585154340-be6161a56a0c"), gallery: [u("photo-1600607687939-ce8a6c25118c"), u("photo-1616486338812-3dadae4b4ace")] },
  { title: "L-Shaped Modular Kitchen", location: "Pillaiyarpalayam", category: "Interior", stage: "Interior", year: 2025, area: "140 sq ft", featured: true,
    description: "BWR plywood carcass, acrylic shutters, soft-close drawers and granite top. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1556909114-f6e7ad7d3136"), gallery: [] },
  { title: "Terrace Metal Sheet Roofing", location: "Kanchipuram", category: "Roofing", stage: "Roofing", year: 2025, area: "1,800 sq ft", featured: true,
    description: "GI truss with colour-coated sheet roofing, ridge cap and gutter over an open terrace. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1568605114967-8130f3a36994"), gallery: [] },
  { title: "Warehouse Shed & Truss Work", location: "Sriperumbudur", category: "Commercial", stage: "Roofing", year: 2024, area: "6,500 sq ft", featured: false,
    description: "MS truss fabrication, purlins and galvalume sheet roof for a storage shed. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1503387762-592deb58ef4e"), gallery: [] },
  { title: "Shop Interior Fit-out", location: "Kanchipuram", category: "Commercial", stage: "Ongoing", year: 2026, area: "900 sq ft", featured: false,
    description: "Display units, false ceiling, lighting and signage for a retail shop. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1497366216548-37526070297c"), gallery: [] },
  { title: "Villa Roof Waterproofing", location: "Kanchipuram", category: "Residential", stage: "Completed", year: 2024, area: "1,200 sq ft", featured: false,
    description: "Terrace crack repair and heat-reflective waterproof coating with a written guarantee. (Sample entry - replace with your own project.)",
    coverImage: u("photo-1600596542815-ffad4c1539a9"), gallery: [] },
];

try {
  await ensureAdmin();
  const count = await Project.countDocuments();
  if (count && !force) {
    console.log(`Projects already exist (${count}). Skipping. Use --force to replace them.`);
  } else {
    if (force) await Project.deleteMany({});
    await Project.insertMany(samples);
    console.log(`Inserted ${samples.length} sample projects.`);
  }
  process.exit(0);
} catch (e) {
  console.error("Seeding error:", e);
  process.exit(1);
}
