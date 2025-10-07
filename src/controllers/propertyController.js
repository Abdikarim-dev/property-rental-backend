const asyncHandler = require("express-async-handler")
const Property = require("../models/Property")

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getAllProperties = asyncHandler(async (req, res) => {
  const { location, type, minPrice, maxPrice, status } = req.query

  // Build query
  const query = {}

  if (location) {
    query.location = { $regex: location, $options: "i" }
  }

  if (type) {
    query.type = type
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  if (status) {
    query.status = status
  } else {
    // Default: only show available properties to public
    if (req.user && req.user.role === "admin") {
      // Admin can see all
    } else {
      query.status = "available"
    }
  }

  const properties = await Property.find(query).populate("agentId", "name email").sort("-createdAt")

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  })
})

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("agentId", "name email avatar")

  if (!property) {
    res.status(404)
    throw new Error("Property not found")
  }

  res.status(200).json({
    success: true,
    data: property,
  })
})

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Agent
exports.createProperty = asyncHandler(async (req, res) => {
  // Add agent id to request body
  req.body.agentId = req.user.id

  const property = await Property.create(req.body)

  res.status(201).json({
    success: true,
    data: property,
  })
})

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Agent/Admin
exports.updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id)

  if (!property) {
    res.status(404)
    throw new Error("Property not found")
  }

  // Check ownership (agent can only update their own properties)
  if (req.user.role === "agent" && property.agentId.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to update this property")
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: property,
  })
})

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Agent/Admin
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)

  if (!property) {
    res.status(404)
    throw new Error("Property not found")
  }

  // Check ownership
  if (req.user.role === "agent" && property.agentId.toString() !== req.user.id) {
    res.status(403)
    throw new Error("Not authorized to delete this property")
  }

  await property.deleteOne()

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  })
})

// @desc    Get agent's properties
// @route   GET /api/properties/agent/my-properties
// @access  Private/Agent
exports.getAgentProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ agentId: req.user.id }).sort("-createdAt")

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  })
})
