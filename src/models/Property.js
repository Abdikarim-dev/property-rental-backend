const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a property title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
  },
  type: {
    type: String,
    required: [true, "Please provide a property type"],
    enum: ["apartment", "house", "condo", "studio", "villa", "other"],
  },
  features: {
    bedrooms: {
      type: Number,
      required: true,
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: true,
      min: [0, "Bathrooms cannot be negative"],
    },
    size: {
      type: Number,
      required: true,
      min: [0, "Size cannot be negative"],
    },
  },
  images: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["available", "booked", "inactive"],
    default: "available",
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for search optimization
propertySchema.index({ location: 1, price: 1, status: 1 })

module.exports = mongoose.model("Property", propertySchema)
