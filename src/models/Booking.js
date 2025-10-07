const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, "Please provide booking amount"],
    min: [0, "Amount cannot be negative"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  dateRange: {
    start: {
      type: Date,
      required: [true, "Please provide start date"],
    },
    end: {
      type: Date,
      required: [true, "Please provide end date"],
    },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Validate date range
bookingSchema.pre("save", function (next) {
  if (this.dateRange.start >= this.dateRange.end) {
    next(new Error("End date must be after start date"))
  }
  next()
})

module.exports = mongoose.model("Booking", bookingSchema)
