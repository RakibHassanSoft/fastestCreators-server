// src/routes/orderRoutes.js
const express = require("express");
const ordeRouter = express.Router();
const { createOrder, getOrders, getOrdersByUser, updateOrder } = require("./order.controller");
const { isAdmin, authenticate } = require("../../middlewares/authMiddleware");

//Admin work
// Get all orders (admin view)
ordeRouter.get("/all",isAdmin, authenticate, getOrders);
// Get orders for a specific user
ordeRouter.get("/user-order/:userId",isAdmin, authenticate, getOrdersByUser);
// Update an order
// ordeRouter.put("/update-order/:orderId", authenticate, updateOrder);


//User work
// Create an order
ordeRouter.post("/create-order", createOrder);



module.exports = ordeRouter;
