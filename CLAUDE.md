# SB Hacks VI Website - Setup Guide (2026)

This document describes how to run this legacy Node.js website from 2020 on a modern system.

## Overview

This is the SB Hacks VI (UC Santa Barbara Hackathon, January 2020) website built with Node.js, Express, and React. It includes:
- Landing page with event information
- User registration and application system
- Admin dashboard for managing applications
- Email notifications via SendGrid
- Resume upload to AWS S3
- Live event page with schedule, prizes, and team info

## System Requirements

- **Node.js 8.2.1** (as specified in package.json)
- **Docker** (recommended for deployment)
- PostgreSQL 10
- MongoDB 3.6

## Tech Stack

### Backend
- **Node.js 8.2.1** + **Express 4.16.3**
- **PostgreSQL** with **Sequelize 4.44.3** for application data
- **MongoDB 5.7.7** with **Mongoose** for session storage
- **Passport.js** for authentication (local strategy)
- **SendGrid** for transactional emails
- **AWS SDK** for S3 resume uploads

### Frontend
- **React 15.5.4** + **Redux**
- **React Router 4.1.1**
- **Semantic UI React 0.82.1** for UI components
- **Webpack 2.7.0** for bundling
- **Sass** (node-sass 4.13.0) for CSS preprocessing

### Development Tools
- **Babel** (ES2015, React, Stage-2 presets)
- **ESLint** for code linting
- **Nodemon** for development server

## Docker Setup

### Local Development

```bash
cd splash-vi
docker compose up --build
```

The website will be available at:
- **Web:** http://localhost:3005
- **PostgreSQL:** localhost:5437
- **MongoDB:** localhost:27019

### Files Created for Docker

1. **Dockerfile**
   - Uses Node.js 8.2.1 base image
   - Fixes Debian Jessie archived repositories
   - Installs Python, make, and g++ for native module compilation (node-sass, bcrypt)
   - Installs npm dependencies
   - Runs build scripts for CSS and React bundles
   - Exposes port 3000

2. **docker-compose.yml**
   - PostgreSQL 10 database with health check
   - MongoDB 3.6 for session storage with health check
   - Node.js web server on port 3005
   - Volume mounts for development
   - Caddy Docker Proxy labels for production
   - Environment variables for database connections
   - Builds CSS on startup to handle gitignored files
   - Named volumes to avoid conflicts with other splash sites

3. **.dockerignore**
   - Excludes node_modules, logs, and development files
   - Reduces build context size

### Health Checks

The `docker-compose.yml` includes health checks for both databases to ensure they're ready before the application starts:

```yaml
# PostgreSQL health check
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U sbhacksvi"]
  interval: 5s
  timeout: 5s
  retries: 5

# MongoDB health check
healthcheck:
  test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
  interval: 5s
  timeout: 5s
  retries: 5
```

## Deploy to Production with Caddy Docker Proxy

If you're using [lucaslorentz/caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy):

### 1. Upload to Server

```bash
cd /home/debian/splash-vi  # or your preferred directory
git clone <your-repo> .
```

### 2. Create .env File

Create a `.env` file with required environment variables:

```bash
# Database
DATABASE_URL=postgresql://sbhacksvi:1234@postgres:5432/sbhacksvi_dev
MONGODB_URI=mongodb://mongo:27017/sbhacksvi

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name

# Session Secret
SESSION_SECRET=your_random_session_secret

# Application
NODE_ENV=production
PORT=3000
```

### 3. Build and Start

```bash
docker compose up -d --build
```

### 4. Automatic Configuration

Caddy will automatically:
- Detect the container via Docker socket
- Configure routing for `2020.sbhacks.com`
- Provision SSL certificate
- Route HTTPS traffic to your container

The `docker-compose.yml` includes:
- Container name: `splash-vi`
- Domain: `2020.sbhacks.com`
- Network: `caddy` (external)
- Reverse proxy to port 3000

**Prerequisites:**
```bash
# Ensure caddy external network exists
docker network ls | grep caddy
# If not found: docker network create caddy
```

## Available Routes

- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Applicant dashboard
- `/apply` - Application form
- `/live` - Live event page (schedule, prizes, buses)
- `/admin` - Admin dashboard (requires admin privileges)

## Database Schema

### PostgreSQL (Sequelize)
- **Users**: User authentication and profile data
- **Applications**: Hacker application submissions (includes ethnicity field added in 2019)
- **Schools**: List of educational institutions
- **Subscribers**: Email newsletter subscribers

### MongoDB (Mongoose)
- **Sessions**: User session storage (via connect-mongo)

## Environment Variables

Required environment variables (create `.env` file):

- `DATABASE_URL`: PostgreSQL connection string
- `MONGODB_URI`: MongoDB connection string
- `SENDGRID_API_KEY`: SendGrid API key for emails
- `AWS_ACCESS_KEY_ID`: AWS access key for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3
- `AWS_BUCKET_NAME`: S3 bucket name for resumes
- `SESSION_SECRET`: Secret for Express sessions
- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 3000)

## Build Process

The application requires building before running:

```bash
npm run build
```

This runs:
1. `css-landing-build` - Compiles landing page Sass to CSS
2. `css-registrant-build` - Compiles registrant page Sass to CSS

The Docker container automatically builds CSS on startup since these files are gitignored.

For development with auto-rebuild:
```bash
npm run css-landing-build:dev   # Watch landing page CSS
npm run css-registrant-build:dev  # Watch registrant CSS
npm run css-live-build:dev        # Watch live page CSS
npm run react-build:dev          # Watch React bundles
```

## Database Migrations

Run migrations and seed data:

```bash
npm run db:migrate  # Run Sequelize migrations
npm run seed        # Seed schools data
```

## Changes Made for Docker Deployment

### 1. Database Configuration

**File:** `src/config/sequelize.json`

**Original:**
```json
{
  "username": "postgres",
  "password": null,
  "host": "localhost"
}
```

**Modified:**
```json
{
  "username": "sbhacksvi",
  "password": "1234",
  "host": "postgres"
}
```

**Why:**
- Changed host from `localhost` to `postgres` (Docker service name)
- Added consistent username/password for Docker PostgreSQL container
- Original used default postgres user with no password

### 2. Debian Repository Fix

**File:** `Dockerfile`

**Added:** Archived Debian Jessie repository configuration with `check-valid-until=no` and `--allow-unauthenticated` flags.

**Why:** Node.js 8.2.1 image is based on Debian Jessie (EOL), which requires archived repositories.

### 3. CSS Build on Startup

**File:** `docker-compose.yml`

**Added:** `npm run build` to startup command

**Why:** CSS files are gitignored. Volume mount overwrites built CSS from Docker image, so we rebuild on startup.

### 4. Named Volumes

**File:** `docker-compose.yml`

**Added:** Named volumes for postgres_data and mongo_data

**Why:** Prevents volume name conflicts when running multiple splash sites (IV, V, VI) simultaneously.

## Known Issues & Security Warnings

1. **Node.js 8.2.1 End of Life**: Node 8 reached EOL in December 2019. This setup is for historical/archival purposes.
2. **Security Vulnerabilities**: Many dependencies have known vulnerabilities. **Do not use for production** with real user data.
3. **Legacy Dependencies**: React 15, Webpack 2, Sequelize 4, Mongoose 5.7, and other dependencies are severely outdated.
4. **MongoDB for Sessions**: Using MongoDB just for sessions is inefficient but that's how the original was built.
5. **Requires .env File**: Application will not start without proper environment variables.
6. **Debian Jessie EOL**: Using archived Debian repositories. Security updates are no longer provided.

**Recommendation:** Use Docker for isolation. Best suited as a historical demo/archive rather than a production application.

## Ports Used

- **3005**: Web server (host)
- **3000**: Web server (container)
- **5437**: PostgreSQL (host)
- **5432**: PostgreSQL (container)
- **27019**: MongoDB (host)
- **27017**: MongoDB (container)

Different ports to allow running multiple SB Hacks sites simultaneously (I, II, III, IV, V, VI).

## Git History

- **initial commit**: Original codebase as-is from 2020
- **chore: dockerize**: Docker setup and modern deployment configuration

## Troubleshooting

### Debian Repository Errors (404 Not Found)

**Error:** `Failed to fetch http://deb.debian.org/debian/dists/jessie/main/binary-amd64/Packages  404  Not Found`

**Solution:** The Node.js 8.2.1 image is based on Debian Jessie (EOL). The Dockerfile has been updated to use archived repositories with `check-valid-until=no` flag and `--allow-unauthenticated` for apt-get.

### Native Module Build Failures

If node-sass or bcryptjs fail to build:
1. Ensure Python, make, and g++ are installed in Dockerfile
2. Check Node version matches 8.2.1 exactly
3. Try rebuilding: `docker compose build --no-cache`

### Database Connection Issues

If PostgreSQL or MongoDB connection fails:
1. Check health checks pass: `docker compose ps`
2. View database logs: `docker compose logs splash-vi-postgres` or `docker compose logs splash-vi-mongo`
3. Verify DATABASE_URL and MONGODB_URI are set correctly
4. Ensure `sequelize.json` has `host: "postgres"` not `localhost`

### Missing CSS Styles

If the page loads but has no styling:
1. CSS files are gitignored and built on container startup
2. Check if build ran: `docker compose logs splash-vi | grep "npm run build"`
3. Manually rebuild: `docker compose exec splash-vi npm run build`
4. Restart container: `docker compose restart splash-vi`

### Missing .env File

Application requires environment variables. Create `.env` file based on template above or contact the original developers for a sample file.

## Development Workflow

1. Start containers: `docker compose up`
2. Access application: http://localhost:3005
3. Make code changes (auto-reload with nodemon)
4. Rebuild assets: `npm run build` (or use watch mode)
5. Run migrations: `npm run db:migrate`

## Production Notes

- Set `NODE_ENV=production` for production deployments
- Use strong `SESSION_SECRET` (generate with `openssl rand -base64 32`)
- Configure real SendGrid API key for emails
- Set up AWS S3 bucket with proper permissions for resume uploads
- Consider using Redis instead of MongoDB for sessions in production

## New Features in SB Hacks VI

Compared to previous versions, SB Hacks VI (2020) includes:
- **Ethnicity field** in applications (migration added Nov 2019)
- **Float rating system** instead of integer (migration added Dec 2019)
- **Enhanced live page** with buses, schedule, prizes sections
- **Team page** showcasing organizers

## Differences from SB Hacks V

SB Hacks VI (2020) is the successor to SB Hacks V (2019). Key differences:
- Newer Sequelize version (4.44.3 vs 4.38.0)
- Newer Mongoose version (5.7.7 vs 5.3.13)
- Additional migrations for ethnicity and rating improvements
- Enhanced Sass styling with team page
- Different subdomain: `2020.sbhacks.com` vs `2019.sbhacks.com`
- Different database name: `sbhacksvi_dev` vs `sbhacksv_development`
- Different ports: 3005/5437/27019 vs 3003/5435/27017

The tech stack and core architecture remain the same.

## Resources

- Node.js 8 Documentation: https://nodejs.org/docs/latest-v8.x/api/
- Express 4 Documentation: https://expressjs.com/en/4x/api.html
- React 15 Documentation: https://15.reactjs.org/
- Sequelize 4 Documentation: https://sequelize.org/v4/
- Original event: SB Hacks VI, January 2020 at UC Santa Barbara

## Credits

Built by the SB Hacks VI development team (based on work by Danny Cho and previous teams).
