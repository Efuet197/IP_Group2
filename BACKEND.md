# CarCare Backend Implementation Guide

## Overview
This backend is built with Node.js, Express, TypeScript, and uses Prisma ORM to interact with a MongoDB database. It powers the CarCare car fault diagnosis system, providing RESTful API endpoints for user management, vehicle and diagnostic data, media uploads, reviews, and AI-powered car fault diagnosis.

## Key Technologies
- **Node.js & Express:** For building scalable REST APIs.
- **TypeScript:** For type safety and maintainability.
- **Prisma ORM:** For database modeling and queries (MongoDB as the database).
- **Mongoose (optional):** Alternative routes provided for direct MongoDB access.
- **Swagger:** For API documentation and testing.
- **Multer:** For handling file uploads (dashboard images, engine sounds).
- **JWT & bcrypt:** For authentication and password security.
- **Axios:** For calling external APIs (AI diagnosis, YouTube search).

## Project Structure
- `src/index.ts` — Main server entry point, Express app setup, Swagger docs, and DB connection.
- `src/routes.ts` — Main API routes using Prisma.
- `src/routes.mongoose.ts` — Alternative API routes using Mongoose.
- `src/swagger.ts` — Swagger documentation setup.
- `prisma/schema.prisma` — Prisma schema defining all models and relationships.
- `DATABASE.md` — Database design and relationship documentation.

## Database Connection
- **Prisma:**
  - The connection string is set in `.env` as `DATABASE_URL` (must be a valid MongoDB URI).
  - Prisma Client is initialized in `src/index.ts` and used in all controllers/routes for DB operations.
  - Example connection code:
    ```ts
    import { PrismaClient } from '@prisma/client';
    const prisma = new PrismaClient();
    prisma.$connect()
      .then(() => console.log('Connected to MongoDB via Prisma'))
      .catch(err => { console.error('Failed to connect:', err); process.exit(1); });
    ```
- **Mongoose (optional):**
  - Used in `src/routes.mongoose.ts` for direct MongoDB access.
  - Connect using:
    ```ts
    import mongoose from 'mongoose';
    mongoose.connect(process.env.DATABASE_URL!);
    ```

## Main Features
- **User Authentication:** Signup/login with JWT, password hashing with bcrypt.
- **Role-based Users:** Car owners and mechanics, with mechanic profiles.
- **Vehicle Management:** CRUD for vehicles owned by users.
- **Media Uploads:** Dashboard images and engine sound files, linked to users and diagnostics.
- **Diagnostics:** Central model linking vehicles, media, reviews, and tutorial videos.
- **AI Diagnosis:** `/diagnose` endpoint accepts image/sound, calls external AI APIs, and returns a diagnosis.
- **YouTube Integration:** After diagnosis, the system searches YouTube for a relevant tutorial and returns the video URL.
- **Reviews & Tutorials:** Users can review diagnostics and view related tutorial videos.
- **Swagger Docs:** All endpoints are documented and testable at `/api-docs`.

## How to Run
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file with a valid `DATABASE_URL` (MongoDB URI) and `YOUTUBE_API_KEY`.
3. Generate Prisma client:
   ```sh
   npx prisma generate
   ```
4. Start the server:
   ```sh
   npm run dev
   ```
5. Access API docs at [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

## Notes
- All database models and relationships are defined in `prisma/schema.prisma`.
- The backend is modular and can be extended with new features or endpoints as needed.
- For advanced queries, use Prisma's population and filtering features.
- For direct MongoDB access, use the Mongoose routes as an alternative.

---
For more details, see the Prisma schema, `DATABASE.md`, and Swagger API documentation.
