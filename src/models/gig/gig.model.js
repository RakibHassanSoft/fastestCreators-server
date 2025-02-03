const mongoose = require("mongoose");

// Validator to ensure exactly three values for packages
const arrayLimit = (val) => val.length === 3;

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

// Package Schema
const FeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Name of the feature
    features: { 
      type: [Boolean], 
      required: true, 
      validate: {
        validator: function (v) {
          return v.length === 3; 
        },
        message: "Visibility array must contain exactly 3 values for Basic, Pro, and Advance."
      }
    }
  }
);
// Highlights Schema
const HighlightSchema = new mongoose.Schema({
  feature: { type: String, required: true },
  detail: { type: String, required: true },
});

// Pricing Schema
const PricingSchema = new mongoose.Schema({
  basic: {
    price: { type: String, required: true },
    description: { type: String, required: true },
    revisions: { type: String, required: true },
    pages: { type: String },
    deliveryTime: { type: String, required: true },
  },
  standard: {
    price: { type: String, required: true },
    description: { type: String, required: true },
    revisions: { type: String, required: true },
    pages: { type: String },
    deliveryTime: { type: String, required: true },
  },
  premium: {
    price: { type: String, required: true },
    description: { type: String, required: true },
    revisions: { type: String, required: true },
    pages: { type: String },
    deliveryTime: { type: String, required: true },
  },
});
const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['image', 'video'], 
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: function () {
      return this.type === 'video'; 
    },
  },
  poster: {
    type: String,
    required: false, 
  },
});
// Gig Schema
const GigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String,  unique: true }, // Added slug field
    owner: {
      image: { type: String, required: true },
      name: { type: String, required: true },
      bio: { type: String, required: true },
    },
    serviceId: {
      type: mongoose.Types.ObjectId, //one-to-one
      ref: "Service",
      required: true,
    },
    bannerImage:{type:String,required:true},
    aboutGig:{type:String,required:true},
    media: [mediaSchema],
    aboutDetails: { type: String, required: true },
    offerings: [{ type: String, required: true }],
    highlights: [HighlightSchema], // Embedding highlights schema
    whyChooseUs: {
      title: { type: String, required: true },
      details:[ { type: String, required: true }],
      points: [{ type: String, required: true }],
    },
    feature: [FeatureSchema], // Embedding packages schema
    pricing: PricingSchema,
    feedbacks: [{ type: mongoose.Types.ObjectId, ref: "Feedback" }], // One-to-many
    frequently: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug
GigSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("title")) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    let uniqueSlug = slug;
    let count = 0;

    // Check for duplicate slugs in the database
    while (await mongoose.models.Gig.findOne({ slug: uniqueSlug })) {
      count++;
      uniqueSlug = `${slug}-${count}`;
    }

    this.slug = uniqueSlug;
  }

  next();
});

GigSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Check if title is being modified in the update
  if (update.title) {
    let slug = update.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure the slug is unique
    let uniqueSlug = slug;
    let count = 0;

    // Check for duplicate slugs in the database
    while (await mongoose.models.Gig.findOne({ slug: uniqueSlug })) {
      count++;
      uniqueSlug = `${slug}-${count}`;
    }

    // Update the slug in the update object
    update.slug = uniqueSlug;
  }

  // Continue with the update
  next();
});

// Models
const Gig = mongoose.model("Gig", GigSchema);
const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = { Gig, Feedback ,GigSchema,FeedbackSchema};
