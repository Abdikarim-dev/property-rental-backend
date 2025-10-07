const asyncHandler = require("express-async-handler")
const Booking = require("../models/Booking")
const Property = require("../models/Property")

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private/Tenant
exports.createBooking = asyncHandler(async (req, res) => {
  const { propertyId, dateRange, amount } = req.body

  // Check if property exists and is available
  const property = await Property.findById(propertyId)

  if (!property) {
    res.status(404)
    throw new Error("Property not found")
  }

  if (property.status !== "available") {
    res.status(400)
    throw new Error("Property is not available for booking")
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    propertyId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        "dateRange.start": { $lte: dateRange.end },
        "dateRange.end": { $gte: dateRange.start },
      },
    ],
  })

  if (overlappingBooking) {
    res.status(400)
    throw new Error("Property is already booked for selected dates")
  }

  const booking = await Booking.create({
    propertyId,
    tenantId: req.user.id,
    dateRange,
    amount: amount || property.price,
  })

  // Update property status
  property.status = "booked"
  await property.save()

  res.status(201).json({
    success: true,
    data: booking,
  })
})

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("propertyId", "title location price")
    .populate("tenantId", "name email")
    .sort("-createdAt")

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Get tenant's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/Tenant
exports.getTenantBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ tenantId: req.user.id })
    .populate("propertyId", "title location price images")
    .sort("-createdAt")

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Get agent's property bookings
// @route   GET /api/bookings/agent/property-bookings
// @access  Private/Agent
exports.getAgentBookings = asyncHandler(async (req, res) => {
  // Find all properties owned by the agent
  const properties = await Property.find({ agentId: req.user.id })
  const propertyIds = properties.map((prop) => prop._id)

  // Find bookings for those properties
  const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
    .populate("propertyId", "title location price")
    .populate("tenantId", "name email")
    .sort("-createdAt")

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("propertyId", "title location price images")
    .populate("tenantId", "name email")

  if (!booking) {
    res.status(404)
    throw new Error("Booking not found")
  }

  // Check authorization
  if (req.user.role === "tenant" && booking.tenantId._id.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to view this booking")
  }

  if (req.user.role === "agent") {
    const property = await Property.findById(booking.propertyId)
    if (property.agentId.toString() !== req.user.id) {
      res.status(403)
      throw new Error("Not authorized to view this booking")
    }
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Agent/Admin
exports.updateBooking = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body

  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error("Booking not found")
  }

  // Check authorization for agents
  if (req.user.role === "agent") {
    const property = await Property.findById(booking.propertyId)
    if (property.agentId.toString() !== req.user.id) {
      res.status(403)
      throw new Error("Not authorized to update this booking")
    }
  }

  if (status) booking.status = status
  if (paymentStatus) booking.paymentStatus = paymentStatus

  // If booking is cancelled, update property status
  if (status === "cancelled") {
    const property = await Property.findById(booking.propertyId)
    property.status = "available"
    await property.save()
  }

  await booking.save()

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private/Tenant
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error("Booking not found")
  }

  // Check if tenant owns this booking
  if (booking.tenantId.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to cancel this booking")
  }

  booking.status = "cancelled"
  await booking.save()

  // Update property status
  const property = await Property.findById(booking.propertyId)
  property.status = "available"
  await property.save()

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  })
})
