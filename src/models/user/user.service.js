const jwt = require("jsonwebtoken");
const User = require("./user.model");
const crypto = require("crypto");

const {
  sendEmailForOtp,
  sendEmailForRegister,
} = require("../../config/nodemailerConfig");
const { updateUserPassword } = require("../../firebase/firebaseAuthUtils");

// Register a new user
const registerUserService = async (userData) => {
  try {
    // Convert email to lowercase
    userData.email = userData.email.toLowerCase();

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const newUser = new User(userData);
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return { newUser, token }; // Return both user data and token
  } catch (error) {
    throw error;
  }
};

// Login a user
const loginUserService = async (userData) => {
  try {
    // Convert email to lowercase
    userData.email = userData.email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: userData.email });

    if (userData.password === "DemoPassword") {
      throw new Error("Password not set. Please create a new password.");
    }

    // If user does not exist or password is missing
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if the password is missing and prompt for a new password
    if (!user.password) {
      throw new Error("Password not set. Please create a new password.");
    }

    // Validate the password
    const isPasswordValid = await user.comparePassword(userData.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return { token }; // Return the token
  } catch (error) {
    throw error;
  }
};

// Login or Register with Social Media
const loginOrRegisterWithSocialMediaService = async (payload) => {
  try {
    const { email, name } = payload;

    // Ensure email is provided from Google login
    if (!email) {
      throw new Error("Email is required from Google login.");
    }

    let user = await User.findOne({ email });

    if (user) {
      // If the user exists, update the user's name
      user.name = name;
      await user.save();
    } else {
      // If the user doesn't exist, create a new user
      const tempPassword = "TempPassword123"; // Temporary password for new users
      user = new User({
        email,
        name,
        password: tempPassword,
      });
      await user.save(); // Save the newly created user
    }

    // Generate a token for the user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return { user, token };
  } catch (error) {
    throw error;
  }
};

// Send OTP for Forgot Password
const sendOtpService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Save OTP and expiration in the database
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + process.env.OTP_EXPIRATION * 1000; // 40 seconds from `.env`
    await user.save();

    // Send the OTP via email
    await sendEmailForOtp(
      email,
      "Password Reset OTP",
      `Your OTP is: ${otp}. It is valid for 40 seconds.`
    );

    return { message: "OTP sent successfully", otp: otp };
  } catch (error) {
    throw error;
  }
};

// Verify OTP
const verifyOtpService = async (email, otp) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Check OTP and expiration
    if (user.otp !== hashedOtp || user.otpExpiry < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: "OTP verified successfully" };
  } catch (error) {
    throw error;
  }
};

// Reset Password
const resetPasswordService = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const data = await updateUserPassword(email, newPassword); // Update the password in Firebase Auth

    if (data.success === true) {
      user.password = newPassword; // Update the user's password (ensure it's hashed)
      await user.save();

      return data;
    } else {
      throw new Error("Failed to update user password");
    }
  } catch (error) {
    throw error;
  }
};

// Update User Role
const updateUserRoleService = async (userId, updateData) => {
  try {
    if (!userId || !updateData) {
      throw new Error("Invalid parameters: userId and updateData are required");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error("An error occurred while updating the user: " + error.message);
  }
};

// Get a single user by ID
const getSingleUserService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

// Get single user by email
const getSingleUserByEmailService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
};

// Get all users
const getAllUsersService = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Mark user as deleted
const deleteUserService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.deleted = true;
    await user.save();

    return { message: "User marked as deleted" };
  } catch (error) {
    throw new Error("Error marking user as deleted: " + error.message);
  }
};

// Add money to user account
const addMoneyService = async (userId, amountToAdd) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    let balance = parseFloat(user.balance);
    let amount = parseFloat(amountToAdd);

    if (isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    user.balance = (balance + amount).toString();
    await user.save();

    return { message: "Money added successfully", newBalance: user.balance };
  } catch (error) {
    throw new Error("Error adding money: " + error.message);
  }
};

// Decrease money from user account
const minusService = async (userId, amountToSubtract) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    let balance = parseFloat(user.balance);
    let amount = parseFloat(amountToSubtract);

    if (isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    user.balance = (balance - amount).toString();
    await user.save();

    return { message: "Money decreased successfully", newBalance: user.balance };
  } catch (error) {
    throw new Error("Error decreasing money: " + error.message);
  }
};

// Find user by email (admin check)
const findAdminService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    return user; 
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
};

module.exports = {
  addMoneyService,
  minusService,
  registerUserService,
  loginUserService,
  updateUserRoleService,
  getSingleUserService,
  getAllUsersService,
  deleteUserService,
  loginOrRegisterWithSocialMediaService,
  getSingleUserByEmailService,
  findAdminService,
  sendOtpService,
  verifyOtpService,
  resetPasswordService,
};
