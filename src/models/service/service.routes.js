const express = require("express");
const serviceRouter = express.Router();
const serviceController = require("./service.controller");
const { authenticate, isAdmin } = require("../../middlewares/authMiddleware");

//Admin
// Create a new service (Only accessible by admin)
serviceRouter.post("/create-service",authenticate,isAdmin, serviceController.createService);

// Get all services
serviceRouter.get("/all", serviceController.getAllServices);

// Get a specific service by ID
serviceRouter.get("/single-service/:id",authenticate,isAdmin, serviceController.getServiceById);

// Update a service (Only accessible by admin)
serviceRouter.put("/update/:id", serviceController.updateService);

// Delete a service (Only accessible by admin)
serviceRouter.delete("/delete-service/:id",authenticate,isAdmin, serviceController.deleteService);


module.exports = serviceRouter;
