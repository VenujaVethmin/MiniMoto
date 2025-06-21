import express from "express";
import { upload, uploadData } from "../controllers/upload.controller.js";


const uploadRoute = express.Router();

uploadRoute.post("/",upload.array("images", 5), uploadData);


export default uploadRoute;
