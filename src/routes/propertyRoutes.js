const express = require("express")
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
} = require("../controllers/propertyController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.get("/", getAllProperties)
router.get("/:id", getProperty)

// Protected routes
router.use(protect)

// Agent routes
router.post("/", authorizeRoles("agent", "admin"), createProperty)
router.get("/agent/my-properties", authorizeRoles("agent"), getAgentProperties)
router.put("/:id", authorizeRoles("agent", "admin"), updateProperty)
router.delete("/:id", authorizeRoles("agent", "admin"), deleteProperty)

module.exports = router
