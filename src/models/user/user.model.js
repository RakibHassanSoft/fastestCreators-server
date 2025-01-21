const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, enum: ["admin", "user"], default: "user" },
  phone:{type: String},
  profile_image: { type: String },
  balance: { type: String, default: "0" },
  isDeleted: { type: Boolean, default: false },
  slug: { type: String, unique: true },
  otp: { type: String }, // Store OTP
  otpExpiry: { type: Date }, // Store OTP expiration time
  // refreshToken: { type: String, default: null },
  // resetToken: { type: String, default: null },
  // tokenExpiry: { type: Date, default: null },
});

// Helper function to generate a slug from a string
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens

// Pre-save middleware to generate slug
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    let slug = generateSlug(this.name);
    let uniqueSlug = slug;
    let count = 0;

    // Check for duplicate slugs in the database
    while (await mongoose.models.User.findOne({ slug: uniqueSlug })) {
      count++;
      uniqueSlug = `${slug}-${count}`;
    }

    this.slug = uniqueSlug;
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
