// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { PrismaClient } from "./generated/prisma/client.js";
import uploadRoute from "../routes/upload.route.js";
import { createUploadsFolder } from "../lib/createUploadsFolder.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Create 'uploads' folder if not exists

await createUploadsFolder();


// Example route using Prisma
app.get("/", async (req, res) => {
  try {
    const data = await prisma.user.create({
      data: {
        email: "venuja@gmail.com",
        name: "venuja",
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Serve static files from uploads folder
app.use("/upload", uploadRoute);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
