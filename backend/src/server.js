import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "../routes/authRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.json("hello world")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
