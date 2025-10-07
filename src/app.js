const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { errorHandler, notFound } = require("./middleware/errorMiddleware")

// Route imports
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const propertyRoutes = require("./routes/propertyRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
)

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

module.exports = app
