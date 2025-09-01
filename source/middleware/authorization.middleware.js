

// Middleware to restrict access to certain roles
// Usage: authorizeRoles('admin', 'manager')
export const authorizeRoles = (...allowedRoles) => {
  // Returns a middleware function
  return (req, res, next) => {
    // 1. Get the user object from the request (set by authentication middleware)
    const user = req.user;

    // 2. Check if user exists and if their role is in the allowedRoles list
    if (!user || !allowedRoles.includes(user.role)) {
      // 3. If not authorized, respond with 403 Forbidden
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    // 4. If authorized, proceed to the next middleware or route handler
    next();
  };
};