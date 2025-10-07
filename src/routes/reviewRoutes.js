const express = require("express")
const {
  createReview,
  getPropertyReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.get("/property/:propertyId", getPropertyReviews)

// Protected routes
router.use(protect)

// Tenant routes
router.post("/", authorizeRoles("tenant"), createReview)
router.put("/:id", authorizeRoles("tenant"), updateReview)

// Admin routes
router.get("/", authorizeRoles("admin"), getAllReviews)

// Shared routes
router.delete("/:id", authorizeRoles("tenant", "admin"), deleteReview)

module.exports = router
