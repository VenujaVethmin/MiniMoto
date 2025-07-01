import express from "express";
import { addProduct, deleteProduct, getAllProduct, getProductById, homePage, updateProduct } from "../controllers/product.controller.js";


const productRoute = express.Router();


productRoute.get("/home", homePage);
productRoute.get("/getAllProduct", getAllProduct);
productRoute.get("/getProductById/:id", getProductById);
productRoute.put("/updateProduct/:id", updateProduct);
productRoute.post("/addProduct", addProduct);
productRoute.post("/deleteProduct/:id", deleteProduct);


export default productRoute;

