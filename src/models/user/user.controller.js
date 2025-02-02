const sendResponse = require('../../utils/responseHelper');
const { loginUserService, registerUserService, getSingleUserService, getAllUsersService, deleteUserService, updateUserRoleService, addMoneyService, minusService, loginOrRegisterWithSocialMediaService, getSingleUserByEmailService, findAdminService, sendOtpService, verifyOtpService, resetPasswordService } = require('./user.service');

//Using cookie
const registerUser = async (req, res) => {
  try {
    const { newUser, token } = await registerUserService(req.body); // Get user and token from the service
    
   
    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Accessible only by the server
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 7 * 60 * 60 * 1000, // 7 hours (same as JWT expiration time)
      // sameSite: 'Strict', // Prevents CSRF
    });

    sendResponse(res, 200, 'User registered successfully', { user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//login user
const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);  // Get the token from the service
    // Set the token as an HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true, // Makes the cookie accessible only by the web server
      secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
      maxAge: 7 * 60 * 60 * 1000, // 7 hours (same as JWT expiration time)
      // sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
    });
    sendResponse(res, 200, 'Login successful');
   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await sendOtpService(email);
  
    sendResponse(res, 200, 'OTP sent successfully');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await verifyOtpService(email, otp);
    
    sendResponse(res, 200, 'Otp varification successfully done ');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await resetPasswordService(email, newPassword);
    sendResponse(res, 200, 'Password reset successfully',response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




const loginUserWithSocialmedia = async (req, res) => {
  try {
    const result = await loginOrRegisterWithSocialMediaService(req.body);  // Get the token from the service
    // Set the token as an HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true, // Makes the cookie accessible only by the web server
      secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
      maxAge: 7 * 60 * 60 * 1000, // 7 hours (same as JWT expiration time)
      // sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
    });
    sendResponse(res, 200, 'Login successful',result);
   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//Update user role
const updateUserUserRole = async (req, res) => {
  const { userId } = req.params;  // Assuming gigId comes from URL params
  const updateData = req.body;   // Assuming update data comes from the request body

  try {
    const updatedUser = await updateUserRoleService(userId, updateData);
    sendResponse(res, 200, 'Login successful',updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
// Controller to get a single user by ID
const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getSingleUserService(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Controller to get a single user by ID
const getSingleUserByEmail = async (req, res) => {
  const { email } = req.query; 
  console.log(email)
  try {
    const user = await getSingleUserByEmailService(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to get all users (excluding deleted ones)
const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    sendResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to mark a user as deleted (logical delete)
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await deleteUserService(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Controller for adding money
const addMoneyOfUser = async (req, res) => {
  try {
    const { userId, amount } = req.body; // Get userId and amount from request body

    if (!userId || !amount) {
      return res.status(400).json({ message: 'userId and amount are required' });
    }

    const response = await addMoneyService(userId, amount); // Call the service function
    return res.status(200).json(response); // Return success response with updated balance
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message }); // Return error response
  }
};

const minusMoneyOfUser = async (req, res) => {
  try {
    const { userId, amount } = req.body; // Get userId and amount from request body

    if (!userId || !amount) {
      return res.status(400).json({ message: 'userId and amount are required' });
    }

    const response = await minusService(userId, amount); // Call the service function
    return res.status(200).json(response); // Return success response with updated balance
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message }); // Return error response
  }
};
//logout coockie
const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    sendResponse(res, 500, 'Logout failed', error.message);
  }
};

const isAdminController = async (req, res) => {
  try {
    // Assuming the user is available through req.user (after authenticate middleware)
  

    const isAdmin = true; // Assuming `isAdmin` is a field in your User model

    // Return the admin status in the response
    res.status(200).json({ isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to check admin status", error: error.message });
  }
};

const findAdminController = async (req, res) => {
  const { email } = req.query; // Get email from query string
  
  try {
    const isAdmin = await findAdminService(email);
 
    if (isAdmin) {
      return sendResponse(res, 200, "User is an admin.",isAdmin);
    } else {
      return sendResponse(res, 403, "User is not an admin.");
    }
  } catch (error) {
    return sendResponse(res, 500, `Error: ${error.message}`);
  }
};
module.exports = { 
  addMoneyOfUser,
  minusMoneyOfUser,
  registerUser,
  loginUser,
  updateUserUserRole,
  getSingleUser,
  getAllUsers,
  deleteUser,
  logoutUser,
  loginUserWithSocialmedia,
  getSingleUserByEmail,
  isAdminController,
  findAdminController,
  sendOtp,
  verifyOtp,
  resetPassword

 };