const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized to access this route")
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      res.status(401)
      throw new Error("User not found")
    }

    if (!req.user.isActive) {
      res.status(401)
      throw new Error("User account is deactivated")
    }

    next()
  } catch (error) {
    res.status(401)
    throw new Error("Not authorized to access this route")
  }
})

// Authorize roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403)
      throw new Error(`User role '${req.user.role}' is not authorized to access this route`)
    }
    next()
  }
}
