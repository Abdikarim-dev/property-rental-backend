# Property Rental System Backend

A complete role-based property rental backend built with Node.js, Express, and MongoDB.

## Features

- **Role-Based Access Control**: Admin, Agent, and Tenant roles with specific permissions
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Property Management**: Full CRUD operations for property listings
- **Booking System**: Create and manage property bookings with date validation
- **Review System**: Tenants can review properties after booking
- **User Management**: Admin can manage all users and their roles

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- Helmet & CORS for security
- express-async-handler for error handling

## Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your configuration:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/property-rental
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
\`\`\`

5. Start the server:
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

## Seed Database

To populate the database with sample data:

\`\`\`bash
npm run seed
\`\`\`

This creates:
- 3 users (admin, agent, tenant)
- 3 properties
- 1 booking
- 1 review

**Sample Credentials:**
- Admin: `admin@example.com` / `admin123`
- Agent: `agent@example.com` / `agent123`
- Tenant: `tenant@example.com` / `tenant123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/profile` - Update own profile (All authenticated users)

### Properties
- `GET /api/properties` - Get all properties (Public)
- `GET /api/properties/:id` - Get single property (Public)
- `POST /api/properties` - Create property (Agent/Admin)
- `PUT /api/properties/:id` - Update property (Agent/Admin)
- `DELETE /api/properties/:id` - Delete property (Agent/Admin)
- `GET /api/properties/agent/my-properties` - Get agent's properties (Agent)

### Bookings
- `POST /api/bookings` - Create booking (Tenant)
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get tenant's bookings (Tenant)
- `GET /api/bookings/agent/property-bookings` - Get agent's property bookings (Agent)
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking status (Agent/Admin)
- `DELETE /api/bookings/:id` - Cancel booking (Tenant)

### Reviews
- `POST /api/reviews` - Create review (Tenant)
- `GET /api/reviews/property/:propertyId` - Get property reviews (Public)
- `GET /api/reviews` - Get all reviews (Admin)
- `PUT /api/reviews/:id` - Update review (Tenant)
- `DELETE /api/reviews/:id` - Delete review (Tenant/Admin)

## Role Permissions

### Admin
- Manage all users
- View all properties, bookings, and reviews
- Update booking statuses
- Delete any review

### Agent
- Create, update, and delete own properties
- View bookings for their properties
- Update booking statuses for their properties

### Tenant
- Browse all available properties
- Create bookings
- Cancel own bookings
- Create and update reviews for booked properties



## Error Handling

The API uses consistent error responses:

\`\`\`json
{
  "success": false,
  "message": "Error message here"
}
\`\`\`

Success responses:

\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Refresh token rotation
- Role-based access control
- Helmet.js for HTTP headers security
- CORS configuration
- Input validation

## Testing

Use tools like Postman or Thunder Client to test the API endpoints. Import the sample credentials after seeding the database.

## License

ISC
# property-rental-backend
