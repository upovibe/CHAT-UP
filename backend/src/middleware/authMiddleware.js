import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT token from cookies
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token is required.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is invalid
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized, token is invalid.' });
    }

    // Find user based on the decoded token
    const user = await User.findById(decoded.userId).select('-password');

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }

    // Attach the user to the request object for use in route handlers
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
    
  } catch (err) {
    console.error('Error in protectRoute middleware:', err.message);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
