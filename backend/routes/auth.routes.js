import express from "express";

import authMiddleware from '../middleware/authMiddleware.js';
import { login, protectedRoute, register } from "../controllers/auth.controller.js";


const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/protected", authMiddleware, protectedRoute);

export default authRoute;
