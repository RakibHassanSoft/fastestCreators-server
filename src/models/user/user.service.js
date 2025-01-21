// services/userService.js
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const crypto = require('crypto');

const { registerSchema, loginSchema } = require('./user.validation'); // Adjust the path as needed
const { sendEmailForOtp, sendEmailForRegister } = require('../../config/nodemailerConfig');
const { updateUserPassword } = require('../../firebase/firebaseAuthUtils');
const JWT_SECRET = 'your_jwt_secret'; 

// Register User
// const registerUserService = async (userData) => {
//   try {
//     const validatedData = await registerSchema.validateAsync(userData);

//     const existingUser = await User.findOne({ email: validatedData.email });
//     if (existingUser) {
//       throw new Error('Email already registered');
//     }

//     const newUser = new User(validatedData);
//      const res = await newUser.save();
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };


// Login User by local storge
// const loginUserService = async (userData) => {
//   try {
//     const validatedData = await loginSchema.validateAsync(userData);

//     const user = await User.findOne({ email: validatedData.email });
//     if (!user || !(await user.comparePassword(validatedData.password))) {
//       throw new Error('Invalid email or password');
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7h' });
//     return { token };
//   } catch (error) {
//     throw error;
//   }
// };
//FOr cookie
const registerUserService = async (userData) => {
  try {

    const validatedData = await registerSchema.validateAsync(userData);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = new User(validatedData);
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7h' });
  

    // sendEmailForRegister(newUser.email, 'Welcome to our platform', newUser.name); // Send welcome email
    return { newUser, token }; // Return both user data and token
  } catch (error) {
    throw error;
  }
};
const loginUserService = async (userData) => {
  try {
    const validatedData = await loginSchema.validateAsync(userData);

    // Check if user exists
    const user = await User.findOne({ email: validatedData.email });

    if(validatedData.password === 'DemoPassword'){
      throw new Error('Password not set. Please create a new password.');
    }
    // If user does not exist or password is missing
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if the password is missing and prompt for a new password
    if (!user.password) {
      throw new Error('Password not set. Please create a new password.');
    }

    // Validate the password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate a token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7h' });
    
    return { token }; // Return the token
  } catch (error) {
    throw error;
  }
};
const loginOrRegisterWithSocialMediaService = async (payload) => {
  try {
    // Destructure relevant fields from Google login data
    const { email, name } = payload;

    // Ensure email is provided from Google login
    if (!email) {
      throw new Error("Email is required from Google login.");
    }

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // If the user exists, update the user's name (or any other fields you want)
      user.name = name; // Update the name field (and other fields if needed)
      await user.save(); // Save the updated user data
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
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7h' });

    // Return the user data and token
    return { user, token };
  } catch (error) {
    // Handle any errors during the process
    throw error;
  }
};

// Send OTP for Forgot Password
const sendOtpService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Save OTP and expiration in the database
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + process.env.OTP_EXPIRATION * 1000; // 40 seconds from `.env`
    await user.save();

    // Send the OTP via email
    await sendEmailForOtp(email, 'Password Reset OTP', `Your OTP is: ${otp}. It is valid for 40 seconds.`);

    return { message: 'OTP sent successfully',otp:otp };
  } catch (error) {
    throw error;
  }
};

// Verify OTP
const verifyOtpService = async (email, otp) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Check OTP and expiration
    if (user.otp !== hashedOtp || user.otpExpiry < Date.now()) {
      throw new Error('Invalid or expired OTP');
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return { message: 'OTP verified successfully' };
  } catch (error) {
    throw error;
  }
};

// Reset Password
const resetPasswordService = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const data = await updateUserPassword(email, newPassword); // Update the password in Firebase Auth
   
   if(data.success === true){
     // Update the user's password (ensure it's hashed)
     user.password = newPassword;  // You should still hash the password before saving it, this is just for the demo
     await user.save();
 
     return data;
   }else{
     throw new Error('Failed to update user password'); 
    }
   
  } catch (error) {
    throw error;
  }
};




const updateUserRoleService = async (userId, updateData) => {
  try {
    // Validate userId and updateData if needed
    if (!userId || !updateData) {
      throw new Error('Invalid parameters: userId and updateData are required');
    }

    // Attempt to find and update the gig
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // Check if the gig exists
    if (!updatedUser) {
      throw new Error('Gig not found');
    }

    return updatedUser;
  } catch (error) {
    throw new Error(error.message || 'An error occurred while updating the gig');
  }
};
// Get a single user by ID
const getSingleUserService = async (userId) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
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
    throw new Error('Error fetching user by email: ' + error.message);
  }
};


// Get all users (optionally excluding deleted users)
const getAllUsersService = async () => {
  try {
    const users = await User.find(); 
    return users;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

// Mark user as deleted (instead of deleting the user)
const deleteUserService = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Mark user as deleted (logical deletion)
    user.deleted = true;
    await user.save();

    return { message: "User marked as deleted" };
  } catch (error) {
    throw new Error('Error marking user as deleted: ' + error.message);
  }
};

// Add Money Service
const addMoneyService = async (userId, amountToAdd) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Convert balance and amountToAdd to numbers (in case balance is a string)
    let balance = parseFloat(user.balance);
    let amount = parseFloat(amountToAdd);

    if (isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    // Add the amount to the user's balance
    user.balance = (balance + amount).toString();

    // Save the updated user document
    await user.save();

    return { message: 'Money added successfully', newBalance: user.balance };
  } catch (error) {
    throw new Error('Error adding money: ' + error.message);
  }
};
// Decrease Money Service
const minusService = async (userId, amountToSubtract) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Convert balance and amountToSubtract to numbers (in case balance is a string)
    let balance = parseFloat(user.balance);
    let amount = parseFloat(amountToSubtract);

    if (isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    // Check if user has enough balance to decrease
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Subtract the amount from the user's balance
    user.balance = (balance - amount).toString();

    // Save the updated user document
    await user.save();

    return { message: 'Money decreased successfully', newBalance: user.balance };
  } catch (error) {
    throw new Error('Error decreasing money: ' + error.message);
  }
};

const findAdminService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is an admin
    if (user.role === "admin") {
      return user; // User is an admin
    } else {
      return false; // User is not an admin
    }
  } catch (error) {
    throw new Error("Error fetching user by email: " + error.message);
  }
};






module.exports = 
{ 
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

