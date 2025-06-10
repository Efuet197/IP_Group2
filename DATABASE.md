# CarCare Database Design (Prisma + MongoDB)

## Overview
This project uses [Prisma ORM](https://www.prisma.io/) with MongoDB as the database for a car fault diagnosis system. The schema is defined in `prisma/schema.prisma` and models the relationships between users, vehicles, diagnostics, media files, reviews, and tutorial videos.

## Key Concepts
- **User Roles:** There are two main user roles: `car_owner` and `mechanic` (see the `UserRole` enum).
- **User:** Stores user details, authentication info, and relations to vehicles, uploaded media, reviews, and mechanic profile.
- **MechanicProfile:** Contains additional info for users who are mechanics (experience, specialization, etc.).
- **Vehicle:** Represents a car owned by a user, with a relation to diagnostics performed on it.
- **DashboardImage & EngineSoundFile:** Media files uploaded by users for diagnostic purposes, each linked to the uploading user and related diagnostics.
- **Review:** Users can write reviews for diagnostics, with each review linked to a user and a diagnostic.
- **TutorialVideo:** Stores YouTube or other tutorial videos related to specific diagnostics and faults.
- **Diagnostic:** Central model representing a diagnostic event, linking to a vehicle, optional dashboard image and engine sound, reviews, and tutorial videos.

## Relationships
- **User ↔ Vehicle:** One-to-many (a user can own multiple vehicles).
- **User ↔ DashboardImage/EngineSoundFile:** One-to-many (a user can upload multiple images/sounds).
- **User ↔ Review:** One-to-many (a user can write multiple reviews).
- **User ↔ MechanicProfile:** One-to-one (if the user is a mechanic).
- **Vehicle ↔ Diagnostic:** One-to-many (a vehicle can have multiple diagnostics).
- **DashboardImage/EngineSoundFile ↔ Diagnostic:** One-to-many (a media file can be used in multiple diagnostics).
- **Diagnostic ↔ Review/TutorialVideo:** One-to-many (a diagnostic can have multiple reviews and tutorial videos).

## Implementation Notes
- All models use MongoDB's ObjectId as the primary key.
- Relations are explicitly defined using Prisma's `@relation` attribute.
- The schema supports advanced queries and population of related data via Prisma Client.
- The design supports extensibility for new media types, diagnostic methods, or user roles.

## File Reference
- **Prisma schema:** `prisma/schema.prisma`
- **Generated Prisma Client:** Used in `src/routes.ts` and controllers for all DB operations.

## Example Entity Flow
1. A user (car owner) uploads a dashboard image or engine sound.
2. The system creates a `DashboardImage` or `EngineSoundFile` record linked to the user.
3. A `Diagnostic` is created, referencing the vehicle, uploaded media, and storing the diagnosis result.
4. The user (or mechanic) can add a `Review` for the diagnostic.
5. The system can link relevant `TutorialVideo` records to the diagnostic for user guidance.

---
For more details, see the Prisma schema and Swagger API documentation.
