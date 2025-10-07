const express = require("express")
const { getAllUsers, getUser, updateUser, deleteUser, updateProfile } = require("../controllers/userController")
const { protect, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

// Protected routes
router.use(protect)

// User profile
router.put("/profile", updateProfile)

// Admin only routes
router.get("/", authorizeRoles("admin"), getAllUsers)
router.get("/:id", authorizeRoles("admin"), getUser)
router.put("/:id", authorizeRoles("admin"), updateUser)
router.delete("/:id", authorizeRoles("admin"), deleteUser)

module.exports = router
