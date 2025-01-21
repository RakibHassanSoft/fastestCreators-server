// src/app/services/gigService.js
const { Gig, Feedback } = require('./gig.model');

// Create a new gig
const createGig = async (gigData) => {
  // console.log(gigData)
  try {
    const gig = new Gig(gigData);
   const res =  await gig.save();

    return res;
  } catch (error) {
    throw new Error('Error creating gig: ' + error.message);
  }
};

// Update gig (single or multiple fields)
const updateGig = async (gigId, updateData) => {
  try {
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      updateData,
      { new: true }
    );
    return updatedGig;
  } catch (error) {
    throw new Error('Error updating gig: ' + error.message);
  }
};

// Add feedback to a gig
const addFeedback = async (gigId, feedbackData) => {
  try {
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Push feedback ID to gig
    await Gig.findByIdAndUpdate(gigId, {
      $push: { feedbacks: feedback._id },
    });

    return feedback;
  } catch (error) {
    throw new Error('Error adding feedback: ' + error.message);
  }
};

// Get all gigs
const getAllGigs = async () => {
  try {
    const gigs = await Gig.find();
    return gigs;
  } catch (error) {
    throw new Error('Error fetching gigs: ' + error.message);
  }
};

// Get a single gig by ID
const getGigById = async (gigId) => {
  try {
    const gig = await Gig.findById(gigId).populate('feedbacks');
    return gig;
  } catch (error) {
    throw new Error('Error fetching gig: ' + error.message);
  }
};
// Get a single gig by ID
const getGigByFieldService = async (value) => {
  try {
    // Find the gig by the value (assuming we're searching by slug)
    const gig = await Gig.findOne({ slug: value }).populate('feedbacks');

    if (!gig) {
      throw new Error('Gig not found');
    }

    return gig;
  } catch (error) {
    throw new Error('Error fetching gig: ' + error.message);
  }
};


const Gigervices= {
  createGig,
  updateGig,
  addFeedback,
  getAllGigs,
  getGigById,
  getGigByFieldService,
};
module.exports = Gigervices;


