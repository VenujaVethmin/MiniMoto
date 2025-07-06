import express from "express";

import authMiddleware from '../middleware/authMiddleware.js';
import { getAllUsers, login, protectedRoute, register } from "../controllers/auth.controller.js";


const authRoute = express.Router();


authRoute.get("/getUsers", getAllUsers);
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/protected", authMiddleware, protectedRoute);

export default authRoute;
