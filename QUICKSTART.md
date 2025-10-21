# Revive MBA - Quick Start Guide

Get the Revive MBA platform up and running in minutes.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (Neon recommended)
- Git

## 1. Clone & Install

```bash
# Navigate to project directory (if not already there)
cd revive-mba

# Install dependencies
npm install
```

## 2. Database Setup

### Create a Neon Database (Recommended)

1. Visit [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string

### Configure Environment

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

Or for local development, create `.dev.vars`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/revive_mba
```

## 3. Initialize Database

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data (3 institutions, 4 programs, specializations, FAQs)
npm run db:seed
```

## 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 5. Explore the Platform

### Public Pages

- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Programs Listing**: [http://localhost:3000/programs](http://localhost:3000/programs)
- **Program Detail**: [http://localhost:3000/programs/1](http://localhost:3000/programs/1)
- **Lead Form**: [http://localhost:3000/lead-form](http://localhost:3000/lead-form)

### Admin Pages (Shell)

- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Note: Auth is not fully implemented, so you'll be redirected to login
  - The admin shell demonstrates the intended structure

### Database Management

```bash
# Open Drizzle Studio for visual database management
npm run db:studio
```

Visit [http://localhost:4983](http://localhost:4983) to manage data directly.

## 6. Test the Lead Form

1. Navigate to [http://localhost:3000/lead-form](http://localhost:3000/lead-form)
2. Complete the 5-step form
3. Submit the form
4. Check the database using Drizzle Studio to see the lead submission

## 7. Filter Programs

1. Go to [http://localhost:3000/programs](http://localhost:3000/programs)
2. Use the filters:
   - **Degree Type**: MBA, PGDM, Executive MBA
   - **Mode**: Online, Blended, Weekend, On-campus
   - **Fee Range**: Set min and max values
   - **Institution**: Select from partner universities
3. Click "Apply filters" to see results

## Common Tasks

### Add More Sample Data

Edit `db/seeds/seed.ts` to add more institutions or programs, then run:

```bash
npm run db:seed
```

### View Database Schema

```bash
# Open Drizzle Studio
npm run db:studio
```

### Check for Linting Issues

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run build
npm run start
```

## Troubleshooting

### Database Connection Error

**Problem**: Cannot connect to database

**Solution**:

1. Verify `DATABASE_URL` in `.env` or `.dev.vars`
2. Check database is running (if local)
3. Ensure network access to Neon (if using Neon)

### Migration Issues

**Problem**: Schema changes not reflecting

**Solution**:

```bash
# Drop existing tables and re-initialize
npm run db:push
npm run db:seed
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:

```bash
# Use a different port
PORT=3001 npm run dev
```

### Missing Dependencies

**Problem**: Module not found errors

**Solution**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

### For Developers

1. **Review the schema**: Check `db/schema.ts` to understand the data model
2. **Explore components**: See how the lead form is built in `app/lead-form/page.tsx`
3. **Study server actions**: Review `app/actions/lead.ts` for mutation patterns
4. **Check validation**: Look at `lib/validations/lead.ts` for Zod schemas

### For Content Editors

1. Use **Drizzle Studio** to:
   - Add new institutions
   - Create programs
   - Add specializations
   - Write FAQs

### For Product Managers

1. Test the **user journey**:
   - Homepage → Programs → Program Detail → Lead Form → Success
2. Review the **admin dashboard structure** at `/admin`
3. Check the **data model** in `db/schema.ts`

## Deployment

### Cloudflare Pages

```bash
# Build and deploy preview
npm run preview

# Deploy to production
npm run deploy
```

Ensure environment variables are set in Cloudflare dashboard:

- `DATABASE_URL`: Your Neon connection string

## Support & Documentation

- **Full Implementation Details**: See `IMPLEMENTATION.md`
- **Original Spec**: See `README.md`
- **Database Schema**: See `db/schema.ts`
- **Design System**: See `app/globals.css`

## Key Features Working

✅ Program catalog with filtering  
✅ Program detail pages with full information  
✅ 5-step lead capture form with validation  
✅ Database seeding with sample data  
✅ Admin dashboard shell with role checks  
✅ Server-side rendering for SEO  
✅ Mobile-responsive design

Enjoy building with Revive MBA! 🚀
