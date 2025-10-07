require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const User = require("../models/User")
const Property = require("../models/Property")
const Booking = require("../models/Booking")
const Review = require("../models/Review")

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Agent",
    email: "agent@example.com",
    password: "agent123",
    role: "agent",
  },
  {
    name: "Jane Tenant",
    email: "tenant@example.com",
    password: "tenant123",
    role: "tenant",
  },
]

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany()
    await Property.deleteMany()
    await Booking.deleteMany()
    await Review.deleteMany()

    console.log("Data cleared...")

    // Create users
    const createdUsers = await User.create(users)
    console.log("Users created...")

    const agent = createdUsers.find((user) => user.role === "agent")
    const tenant = createdUsers.find((user) => user.role === "tenant")

    // Create properties
    const properties = [
      {
        title: "Modern Downtown Apartment",
        description: "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.",
        price: 2500,
        location: "New York, NY",
        type: "apartment",
        features: {
          bedrooms: 2,
          bathrooms: 2,
          size: 1200,
        },
        images: ["apartment1.jpg", "apartment2.jpg"],
        status: "available",
        agentId: agent._id,
      },
      {
        title: "Cozy Studio Near Park",
        description: "Charming studio apartment with park views and modern amenities.",
        price: 1500,
        location: "San Francisco, CA",
        type: "studio",
        features: {
          bedrooms: 0,
          bathrooms: 1,
          size: 600,
        },
        images: ["studio1.jpg"],
        status: "available",
        agentId: agent._id,
      },
      {
        title: "Luxury Villa with Pool",
        description: "Spacious 4-bedroom villa with private pool and garden.",
        price: 5000,
        location: "Los Angeles, CA",
        type: "villa",
        features: {
          bedrooms: 4,
          bathrooms: 3,
          size: 3000,
        },
        images: ["villa1.jpg", "villa2.jpg", "villa3.jpg"],
        status: "available",
        agentId: agent._id,
      },
    ]

    const createdProperties = await Property.create(properties)
    console.log("Properties created...")

    // Create a sample booking
    const booking = await Booking.create({
      propertyId: createdProperties[0]._id,
      tenantId: tenant._id,
      amount: 2500,
      paymentStatus: "completed",
      status: "confirmed",
      dateRange: {
        start: new Date("2025-02-01"),
        end: new Date("2025-03-01"),
      },
    })
    console.log("Booking created...")

    // Create a sample review
    await Review.create({
      propertyId: createdProperties[0]._id,
      tenantId: tenant._id,
      rating: 5,
      comment: "Amazing apartment! Great location and very clean.",
    })
    console.log("Review created...")

    console.log("\n✅ Database seeded successfully!")
    console.log("\nSample credentials:")
    console.log("Admin: admin@example.com / admin123")
    console.log("Agent: agent@example.com / agent123")
    console.log("Tenant: tenant@example.com / tenant123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
