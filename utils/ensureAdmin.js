import User from "../models/User.js";

// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD if none exists.
// Handy on Render's free plan where there is no shell to run `npm run seed`.
export default async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    console.log("[admin] ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin bootstrap");
    return;
  }
  const exists = await User.findOne({ role: "admin" });
  if (exists) return;
  await User.create({ name: "Site Admin", email, password, role: "admin" });
  console.log(`[admin] created admin user ${email}`);
}
