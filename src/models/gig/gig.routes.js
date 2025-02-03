const express = require("express");
const gigsRouter = express.Router();

// Importing the controller functions
const {
  createGigController,
  updateGigController,
  addFeedbackController,
  getAllGigsController,
  getGigByIdController,
  getGigByFieldController,
} = require("./gig.controller");
const { authenticate, isAdmin } = require("../../middlewares/authMiddleware");

// Routes for gig-related actions

//admin
// Create a new gig
gigsRouter.post("/sigle-gig", authenticate,isAdmin, createGigController);

// Update an existing gig
gigsRouter.put("/update/:gigId",authenticate,isAdmin, updateGigController);



//Normal
// Get all gigs
gigsRouter.get("/all", getAllGigsController);

// Get a specific gig by ID
gigsRouter.get("/get-signle-gig/:gigId", getGigByIdController);

// get single by field  and value
gigsRouter.get("/single-gig/:field/:value", getGigByFieldController);



//User
// Add feedback to a gig
gigsRouter.post("/feedback/:gigId",authenticate, addFeedbackController);




module.exports = gigsRouter;
