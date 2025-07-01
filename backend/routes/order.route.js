import express from "express";
import { getAllOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";



const orderRoute = express.Router();


orderRoute.post("/place-order", placeOrder);

orderRoute.get("/getAllOrders", getAllOrders);

orderRoute.put("/updateOrderStatus/:id", updateOrderStatus);



export default orderRoute;

