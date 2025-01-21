const jwt = require('jsonwebtoken');
const User = require('../models/user/user.model');

const authenticate = async (req, res, next) => {
  // Check for token in cookies
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next(); 
};

module.exports = { authenticate, isAdmin };




// const jwt = require('jsonwebtoken');
// const User = require('../models/user/user.model');

// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; 
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, "your_jwt_secret"); 
//     const user = await User.findById(decoded.id); 
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     req.user = user; 
//     next(); 
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
//   next(); 
// };

// module.exports = { authenticate, isAdmin };
