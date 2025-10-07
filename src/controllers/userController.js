const asyncHandler = require("express-async-handler")
const User = require("../models/User")

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken")

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken")

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body

  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  user.name = name || user.name
  user.email = email || user.email
  user.role = role || user.role
  user.isActive = isActive !== undefined ? isActive : user.isActive

  const updatedUser = await user.save()

  res.status(200).json({
    success: true,
    data: updatedUser,
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body

  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  user.name = name || user.name
  user.email = email || user.email
  user.avatar = avatar || user.avatar

  const updatedUser = await user.save()

  res.status(200).json({
    success: true,
    data: updatedUser,
  })
})
