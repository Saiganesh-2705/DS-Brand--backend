import express from "express";
import mongoose from "mongoose";
import Image from "../models/Image.js";

const router = express.Router();

// Public: serve an uploaded photo (cached hard - ids never change content).
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end();
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).end();
    res.set("Content-Type", img.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    res.send(img.data);
  } catch (e) {
    next(e);
  }
});

export default router;
