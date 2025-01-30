# Phoenix IMF Gadget API


## Features

- JWT Authentication via HTTP-only cookies
- Role-based access control (ADMIN & AGENT roles)
- CRUD operations for gadgets with status tracking
- Self-destruct sequence simulation with confirmation codes
- Rate limiting on critical operations
- Status-based filtering for gadgets
- Random codename generation for gadgets
- Mission success probability generation

## Tech Stack

- Node.js & Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod for validation
- bcrypt for password hashing


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/whonehuljain/Phoenix-gadgets-api
cd Phoenix-gadgets-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Update the `.env` file with your configuration:
```env
PORT=8000
DATABASE_URL="postgresql://username:password@localhost:5432/db_name"
NODE_ENV=development
JWT_SECRET="your-secret-key"
```

4. Run database migrations
```bash
npx prisma migrate deploy
```

5. Generate Prisma Client
```bash
npx prisma generate
```

6. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Base URL
- Local: `http://localhost:8000`
- Deployed: `https://phoenix-gadgets-api.onrender.com`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```
- Creates a new user account
- Default role is "AGENT"
- For ADMIN role, explicitly add `"role": "ADMIN"` in request body

Request Body:
```json
{
    "email": "agent@imf.gov",
    "password": "secret123",
    "name": "Ethan Hunt",
    "role": "AGENT"  // Optional
}
```

#### Login
```http
POST /auth/login
```
Request Body:
```json
{
    "email": "agent@imf.gov",
    "password": "secret123"
}
```

### Gadget Endpoints

#### Get All Gadgets
```http
GET /gadgets
```
- Optional query parameter: `status` (AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED)
- Returns all non-decommissioned gadgets with random success probabilities

#### Create Gadget (Admin Only)
```http
POST /gadgets
```
Request Body:
```json
{
    "name": "Explosive Chewing Gum"
}
```

#### Update Gadget (Admin Only)
```http
PATCH /gadgets/:id
```
Request Body:
```json
{
    "name": "Updated Name",
    "status": "DEPLOYED"  // Optional
}
```

#### Decommission Gadget (Admin Only)
```http
DELETE /gadgets/:id
```
- Marks gadget as decommissioned instead of deleting

### Self-Destruct Endpoints

#### Initiate Self-Destruct
```http
POST /gadgets/:id/self-destruct
```
- Available to both ADMIN and AGENT roles
- Returns a confirmation code valid for 5 minutes

#### Confirm Self-Destruct
```http
POST /gadgets/:id/self-destruct
```
Request Body:
```json
{
    "confirmationCode": "ABC123XY"
}
```

### Health Check
```http
GET /ping
```
Returns API health status

## Security Features

1. **Authentication:**
   - JWT tokens stored in HTTP-only cookies
   - Password hashing using bcrypt
   - Secure session management

2. **Authorization:**
   - Role-based access control (ADMIN/AGENT)
   - Protected routes with middleware checks

3. **Rate Limiting:**
   - Self-destruct attempts limited to 5 per minute per gadget
   - Cooldown period enforcement

4. **Input Validation:**
   - Request validation using Zod
   - Sanitized database queries using Prisma

## Error Handling

The API returns consistent error responses in the following format:
```json
{
    "success": false,
    "error": {
        "message": "Error description"
    }
}
```

Common error scenarios:
- Authentication required
- Invalid credentials
- Unauthorized access
- Resource not found
- Rate limit exceeded
- Validation errors

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.