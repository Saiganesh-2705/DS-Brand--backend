import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import ensureAdmin from "./utils/ensureAdmin.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // Render sits behind a proxy

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);
// Vercel preview deployments (*.vercel.app) are allowed unless you set ALLOW_VERCEL_PREVIEWS=false
const allowPreviews = process.env.ALLOW_VERCEL_PREVIEWS !== "false";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      let ok = allowedOrigins.includes(origin.replace(/\/$/, ""));
      if (!ok && allowPreviews) {
        try { ok = new URL(origin).hostname.endsWith(".vercel.app"); } catch { ok = false; }
      }
      if (!allowedOrigins.length && !allowPreviews) ok = true;
      cb(null, ok);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Cheap spam protection on the public form and login.
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { message: "Too many requests, please try again later." } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false, message: { message: "Too many login attempts, please try again later." } });

app.get("/", (req, res) => res.json({ status: "ok", service: "DS Brand API" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", message: "DS Brand API is running" }));

app.use("/api/auth/login", loginLimiter);
app.post("/api/contact", formLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/images", imageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();
await ensureAdmin().catch((e) => console.error("[admin] bootstrap failed:", e.message));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`[notify] channels: ${process.env.NOTIFY_CHANNEL || "none"}`);
});
