// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { createUploadsFolder } from "../lib/createUploadsFolder.js";
import uploadRoute from "../routes/upload.route.js";
import authRoute from './../routes/auth.routes.js';
import productRoute from "../routes/product.route.js";
import orderRoute from "../routes/order.route.js";



dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

// Create 'uploads' folder if not exists

await createUploadsFolder();


// Example route using Prisma
app.get("/", async (req, res) => {
 res.json({ message: "Welcome to MiniMoto API!" });
});

// Serve static files from uploads folder
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api/upload", uploadRoute);

app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
