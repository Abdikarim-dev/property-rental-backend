const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  comment: {
    type: String,
    required: [true, "Please provide a comment"],
    maxlength: [500, "Comment cannot be more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Prevent duplicate reviews from same tenant for same property
reviewSchema.index({ propertyId: 1, tenantId: 1 }, { unique: true })

module.exports = mongoose.model("Review", reviewSchema)
