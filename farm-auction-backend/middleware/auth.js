// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get the token from the request header (frontend will send this)
  const token = req.header('x-auth-token');

  // 2. Check if no token was sent
  if (!token) {
    // If no token, deny access immediately
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If a token was sent, try to verify it
  try {
    // Verify the token using the same secret key used to create it
    // IMPORTANT: Replace 'yourSecretKey' with your actual secure key later!
    const decoded = jwt.verify(token, 'yourSecretKey');

    // 4. If verification is successful, the 'decoded' variable contains the payload
    //    (which includes the user's ID and role).
    //    We attach this payload to the request object (`req.user`) so that
    //    subsequent route handlers can know who the logged-in user is.
    req.user = decoded.user; 

    // 5. Call 'next()' to pass control to the next middleware or the actual route handler.
    next();

  } catch (err) {
    // 6. If verification fails (e.g., token is invalid or expired), deny access.
    res.status(401).json({ msg: 'Token is not valid' });
  }
};