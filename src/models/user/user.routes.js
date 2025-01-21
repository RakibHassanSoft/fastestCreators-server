const express = require('express');
const { registerUser, loginUser, updateUserUserRole, getSingleUser, getAllUsers, deleteUser, addMoneyOfUser, minusMoneyOfUser, logoutUser, loginUserWithSocialmedia, getSingleUserByEmail, isAdminController, findAdminController, sendOtp, verifyOtp, resetPassword } = require('./user.controller');
const { authenticate, isAdmin } = require('../../middlewares/authMiddleware');
const UserRouter = express.Router();

//Admin
// PUT /Update user
UserRouter.put('/update-user/:userId', updateUserUserRole);
// Route to get a single user by ID
UserRouter.get('/:userId',authenticate,isAdmin, getSingleUser);
// Route to get a single user by ID
UserRouter.get('/main-auth',authenticate,isAdmin, isAdminController);
// Route to get all users (excluding deleted ones)
UserRouter.get('/',authenticate,isAdmin, getAllUsers);
// Route to delete a user (mark as deleted)
UserRouter.put('/:userId/delete', deleteUser);

// add money(Optional)
UserRouter.post('/add-money',authenticate,isAdmin, addMoneyOfUser);
//minus money from user
UserRouter.post('/minus-money',authenticate,isAdmin, minusMoneyOfUser);

//User
// POST /register
UserRouter.post('/register', registerUser);
// POST /login
UserRouter.post('/login', loginUser);
// POST /login
UserRouter.post('/login-by-socialmedia', loginUserWithSocialmedia);
// logout user
UserRouter.post('/logout-user', logoutUser);


UserRouter.post('/send-otp', sendOtp);
UserRouter.post('/verify-otp', verifyOtp);
UserRouter.post('/reset-password', resetPassword);


//Auth 

UserRouter.post('/check-admin', findAdminController);
;


module.exports = UserRouter;
