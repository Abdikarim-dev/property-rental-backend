const express = require("express")
const { register, login, getMe, logout, refreshToken } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.post("/logout", protect, logout)
router.post("/refresh", refreshToken)

module.exports = router
