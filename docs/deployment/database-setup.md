# Database Setup Guide

This document provides detailed instructions for setting up the PostgreSQL database for Q-Ease.

## Prerequisites

- PostgreSQL installed and running
- pgAdmin 4 (optional, for GUI management)
- Node.js v18+ and npm
- Git (for cloning the repository)

## Manual Database Setup

### 1. Create the Database

Using pgAdmin:
1. Open pgAdmin 4
2. Connect to your PostgreSQL server
3. Right-click "Databases" under your server
4. Select "Create" → "Database"
5. Enter database name: `qease_db`
6. Click "Save"

Or using SQL command line:
```sql
CREATE DATABASE qease_db;
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRESQL_PASSWORD@localhost:5432/qease_db"
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN=24h

# Redis (for caching and real-time features)
REDIS_URL="redis://localhost:6379"
```

Replace `YOUR_POSTGRESQL_PASSWORD` with your actual PostgreSQL password.

### 3. Install Dependencies and Generate Prisma Client

From the backend directory:
```bash
cd backend
npm install
npx prisma generate
```

### 4. Run Database Migrations

Apply the schema to create all tables:
```bash
npx prisma migrate dev --name init
```

### 5. Seed Initial Data

Populate the database with initial data:
```bash
npx prisma db seed
```

## Automated Setup Script

Alternatively, you can use the automated setup script from the project root:

```bash
# Install root dependencies
npm install

# Run the complete setup
npm run setup-db
```

This will:
1. Create the database if it doesn't exist
2. Generate the Prisma client
3. Run migrations to create tables
4. Seed initial data

## Verification

### Using Prisma Studio
View the database contents with Prisma Studio:
```bash
npx prisma studio
```

### Check Tables Exist
Verify that all tables were created correctly:
- User
- Organisation
- RoleModel
- Queue
- Token
- Notification
- Analytics

## Troubleshooting

### Common Issues

#### Authentication Failed (P1000)
- Verify PostgreSQL is running
- Check username and password in `.env`
- Ensure PostgreSQL service is started

#### Prisma Schema Validation Errors
- Run `npx prisma format` to fix formatting issues
- Run `npx prisma generate` after schema changes
- Verify all relation names are unique

#### Migration Errors
- Ensure the database connection string is correct
- Make sure the database exists
- Check that the user has CREATE permissions

### Resetting the Database

To reset the database (this will delete all data):
```bash
npx prisma migrate reset
```

## Database Schema Overview

The Q-Ease database consists of the following main entities:

- **Organisation**: Represents businesses/institutions using the system
- **User**: System users with different roles
- **RoleModel**: Access control roles (ADMIN, STAFF, USER)
- **Queue**: Service queues within organisations
- **Token**: Virtual tokens representing queue positions
- **Notification**: System notifications
- **Analytics**: Performance metrics and statistics

## Production Considerations

For production deployments:
- Use stronger passwords for database access
- Implement proper backup strategies
- Consider connection pooling settings
- Monitor database performance
- Implement proper SSL/TLS connections