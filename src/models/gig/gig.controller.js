const HTTP_STATUS = require("../../utils/httpStatus");
const sendResponse = require("../../utils/responseHelper");
const Gigervices = require("./gig.service");

// Create a new gig
const createGigController = async (req, res) => {
  try {
    // need to check of the service is aviable or not
    const gigData = req.body;
    const gig = await Gigervices.createGig(gigData);
    sendResponse(res, HTTP_STATUS.OK, "Gig created successfully", gig);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

// Update a gig
const updateGigController = async (req, res) => {
  try {
    const { gigId } = req.params;
    const updateData = req.body;
    const updatedGig = await Gigervices.updateGig(gigId, updateData);
    sendResponse(res, HTTP_STATUS.OK, "Gig updated successfully", updatedGig);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error);
  }
};

// Add feedback to a gig
const addFeedbackController = async (req, res) => {
  try {
    const { gigId } = req.params;
    const feedbackData = req.body;
    const feedback = await Gigervices.addFeedback(gigId, feedbackData);
    sendResponse(res, HTTP_STATUS.OK, "Feedback added successfully", feedback);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error);
  }
};

// Get all gigs
const getAllGigsController = async (req, res) => {
  try {
    const gigs = await Gigervices.getAllGigs();
    sendResponse(res, HTTP_STATUS.OK, "Gigs fetched successfully", gigs);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error);
  }
};

// Get a single gig by ID
const getGigByIdController = async (req, res) => {
  try {
    const { gigId } = req.params;
    const gig = await Gigervices.getGigById(gigId);
    sendResponse(res, HTTP_STATUS.OK, "Gig fetched successfully", gig);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error);
  }
};

const getGigByFieldController = async (req, res) => {
  try {
    // Extract field and value from query parameters
    const { value } = req.params;

    // Call the service function with the provided field and value
    const gig = await Gigervices.getGigByFieldService(value);

    // Send the gig data in response
    res.status(200).json({ success: true, data: gig });
  } catch (error) {
    // Send error response
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = {
  createGigController,
  updateGigController,
  addFeedbackController,
  getAllGigsController,
  getGigByIdController,
  getGigByFieldController,
};
