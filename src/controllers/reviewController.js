const asyncHandler = require("express-async-handler")
const Review = require("../models/Review")
const Booking = require("../models/Booking")

// @desc    Create review
// @route   POST /api/reviews
// @access  Private/Tenant
exports.createReview = asyncHandler(async (req, res) => {
  const { propertyId, rating, comment } = req.body

  // Check if tenant has booked this property
  const booking = await Booking.findOne({
    propertyId,
    tenantId: req.user.id,
    status: { $in: ["confirmed", "completed"] },
  })

  if (!booking) {
    res.status(400)
    throw new Error("You must book this property before reviewing")
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    propertyId,
    tenantId: req.user.id,
  })

  if (existingReview) {
    res.status(400)
    throw new Error("You have already reviewed this property")
  }

  const review = await Review.create({
    propertyId,
    tenantId: req.user.id,
    rating,
    comment,
  })

  res.status(201).json({
    success: true,
    data: review,
  })
})

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
exports.getPropertyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ propertyId: req.params.propertyId })
    .populate("tenantId", "name avatar")
    .sort("-createdAt")

  // Calculate average rating
  const avgRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

  res.status(200).json({
    success: true,
    count: reviews.length,
    avgRating: avgRating.toFixed(1),
    data: reviews,
  })
})

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("propertyId", "title location")
    .populate("tenantId", "name email")
    .sort("-createdAt")

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  })
})

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Tenant
exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const review = await Review.findById(req.params.id)

  if (!review) {
    res.status(404)
    throw new Error("Review not found")
  }

  // Check if user owns this review
  if (review.tenantId.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to update this review")
  }

  review.rating = rating || review.rating
  review.comment = comment || review.comment

  await review.save()

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Tenant/Admin
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    res.status(404)
    throw new Error("Review not found")
  }

  // Check authorization
  if (req.user.role !== "admin" && review.tenantId.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to delete this review")
  }

  await review.deleteOne()

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  })
})
