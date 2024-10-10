# Fullstack Assessment

This is a simple fullstack assessment with a React frontend, a Node.js backend and a PostgreSQL database.

## Running the project

Run the following command to start the project:

```
docker compose up -d
```

```
pnpm run start
```

# Project Overview

This project is a full-stack web application built using a monorepo structure with Turborepo for easier development and code sharing.

## Backend (apps/server)

- Built with Express.js
- Business logic is implemented directly in the controllers
- Uses Zod for request parameter validation in middleware

## Frontend (apps/web)

- Built with Next.js
- Utilizes React Query for data fetching and state management
- Implements React Hook Form for form handling and validation

## Database

- Uses PostgreSQL
- Can be easily set up and run using Docker Compose

## Development Environment

- Uses pnpm as the package manager
- Employs Turborepo for managing the monorepo structure, enabling easier development and code sharing between packages

## Getting Started

To run the project:

1. Set up the database:

   ```
   docker-compose up
   ```

2. Start the application:
   ```
   pnpm run start
   ```

This setup provides a solid foundation for developing and scaling a full-stack web application with shared code and efficient development practices.
