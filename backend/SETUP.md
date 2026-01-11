# 🚀 Backend Setup & Installation Guide

## Step 1: Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install @google/generative-ai axios @supabase/supabase-js
```

## Step 2: Verify Environment Variables

Make sure your `backend/.env` file has all required variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Database Configuration
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url

# AI Services
GEMINI_API_KEY=AIzaSyBuv-exLTTjsoz70Iauxmd5wNPnHB3n8so
UNSPLASH_ACCESS_KEY=I87zl-Wfv7zlbSjT6SoxL9SQ175zuqEIHWFpUGBsMlo
```

✅ **Gemini and Unsplash keys are already added!**

## Step 3: Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

This creates the TypeScript types for your database schema.

## Step 4: Run Database Migrations (if needed)

If you haven't run migrations yet:

```bash
cd backend
npm run prisma:migrate
```

## Step 5: Start the Backend Server

From the **root** `eventora` directory:

```bash
npm run dev
```

This will start **both** frontend and backend concurrently!

Or start backend only:

```bash
cd backend
npm run dev
```

## Step 6: Test the API

Once running, you should see:

```
🚀 Eventora API Server running on port 5000
📍 Environment: development
🔗 Frontend: http://localhost:3000

📋 Available endpoints:
   GET  /health
   POST /api/ai/generate-event
   GET  /api/events
   POST /api/events
```

### Test the Health Endpoint

Open in browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Eventora API is running"
}
```

### Test AI Generation (Simple test)

```bash
curl -X POST http://localhost:5000/api/ai/generate-event \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tech conference in San Francisco about AI"}'
```

You should get a JSON response with:
- Generated title
- Description
- Categories
- Location suggestions
- Cover images from Unsplash

---

## 🎯 What's Been Built

### Backend Services ✅
- **Gemini AI Service** - Generates event details from prompts
- **Unsplash Service** - Fetches relevant cover images
- **Authentication Middleware** - Verifies Supabase JWTs

### API Endpoints ✅
- `POST /api/ai/generate-event` - AI event generation
- `GET /api/events` - List all events (with pagination)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (requires auth)
- `PATCH /api/events/:id` - Update event (requires auth)
- `DELETE /api/events/:id` - Delete event (requires auth)

### Optimizations ✅
- ✅ Response caching for AI prompts (1 hour TTL)
- ✅ Graceful error handling with fallbacks
- ✅ Parallel API calls (AI + Images)
- ✅ Input validation
- ✅ Proper TypeScript types
- ✅ Database query optimization

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Run `npm install` in the backend directory
- Make sure you're in the correct directory

### Prisma errors
- Run `npm run prisma:generate` in backend directory
- Check DATABASE_URL is correct in `.env`

### Port already in use
- Change PORT in `.env` to 5001 or another port
- Stop any other processes using port 5000

### CORS errors
- Check FRONTEND_URL in `.env` matches your frontend (http://localhost:3000)
- Make sure both servers are running

---

## ✨ Next Steps

1. **Test the AI generation** - Use the create event page
2. **Update frontend** - Connect to real APIs (I'll do this next!)
3. **Test event creation** - Create an event from AI-generated data
4. **Verify database** - Check events are being saved

**Ready to proceed with frontend integration!** 🚀
