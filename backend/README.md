# Backend - E-commerce NX Starter

## Overview
NestJS backend application with PostgreSQL database using TypeORM.

## Environment Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Yarn package manager

### Database Setup

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   # Access PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ecommerce_db;
   
   # Create user (optional)
   CREATE USER ecommerce_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=ecommerce_db
   DATABASE_SSL=false
   
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

## Development

### Install Dependencies
```bash
yarn install
```

### Run Development Server
```bash
yarn nx serve backend
```

### Build
```bash
yarn nx build backend
```

### Test Database Connection
Once the server is running, visit:
- Health check: `http://localhost:3000/health`
- Database test: `http://localhost:3000/db/test`
- Create test user: `http://localhost:3000/db/create-test-user`
- Get users: `http://localhost:3000/db/users`

## Database Schema

### User Entity
- `id`: UUID primary key
- `email`: Unique email address
- `name`: User's full name
- `avatar`: Optional avatar URL
- `status`: User status (default: 'active')
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

### Health & Status
- `GET /` - Basic app data
- `GET /health` - Health check

### Database Testing
- `GET /db/test` - Test database connection
- `GET /db/users` - Get all users
- `GET /db/create-test-user` - Create a test user

## Production Deployment

1. Set `NODE_ENV=production`
2. Set `DATABASE_SSL=true` for secure connections
3. Use strong database credentials
4. Configure proper connection pooling
5. Set up database migrations 