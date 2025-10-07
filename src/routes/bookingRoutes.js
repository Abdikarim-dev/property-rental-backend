const express = require("express")
const {
  createBooking,
  getAllBookings,
  getTenantBookings,
  getAgentBookings,
  getBooking,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

// All routes are protected
router.use(protect)

// Tenant routes
router.post("/", authorizeRoles("tenant"), createBooking)
router.get("/my-bookings", authorizeRoles("tenant"), getTenantBookings)
router.delete("/:id", authorizeRoles("tenant"), cancelBooking)

// Agent routes
router.get("/agent/property-bookings", authorizeRoles("agent"), getAgentBookings)

// Admin routes
router.get("/", authorizeRoles("admin"), getAllBookings)

// Shared routes
router.get("/:id", getBooking)
router.put("/:id", authorizeRoles("agent", "admin"), updateBooking)

module.exports = router
