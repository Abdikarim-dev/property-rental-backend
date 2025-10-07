const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "tenant",
  })

  if (user) {
    const accessToken = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Save refresh token to user
    user.refreshToken = refreshToken
    await user.save()

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        accessToken,
        refreshToken,
      },
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    res.status(400)
    throw new Error("Please provide email and password")
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password")

  if (!user || !(await user.comparePassword(password))) {
    res.status(401)
    throw new Error("Invalid credentials")
  }

  if (!user.isActive) {
    res.status(401)
    throw new Error("Account is deactivated")
  }

  const accessToken = generateToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  // Save refresh token
  user.refreshToken = refreshToken
  await user.save()

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      accessToken,
      refreshToken,
    },
  })
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null })

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  })
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(401)
    throw new Error("Refresh token required")
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select("+refreshToken")

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401)
      throw new Error("Invalid refresh token")
    }

    const newAccessToken = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    })
  } catch (error) {
    res.status(401)
    throw new Error("Invalid refresh token")
  }
})
