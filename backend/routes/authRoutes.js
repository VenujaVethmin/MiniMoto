import express from "express";
import { login, protectedRoute, register } from "../controllers/authController.js";
import authMiddleware from './../middleware/authMiddleware.js';


const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/protected", authMiddleware, protectedRoute);

export default authRoute;
