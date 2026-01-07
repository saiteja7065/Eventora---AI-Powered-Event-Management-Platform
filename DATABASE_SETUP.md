# Database Setup Guide for Eventora

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Create a new organization if you don't have one
5. Click **"New Project"**
6. Fill in the details:
   - **Name**: `eventora` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development
7. Click **"Create new project"**
8. Wait 2-3 minutes for project to be ready

---

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Click on the **"Settings"** icon (gear) in the left sidebar
2. Go to **"API"** section
3. Copy these values (you'll need them):

   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   service_role key: eyJhbGc... (click "Reveal" to see it)
   ```

4. Go to **"Database"** section in settings
5. Scroll down to **"Connection string"**
6. Select **"URI"** tab
7. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@xxxxx.supabase.co:5432/postgres
   ```
8. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created in Step 1

---

## Step 3: Set Up Environment Variables

I'll create the environment files for you. You just need to paste your credentials!

---

## Step 4: Install Prisma

Run these commands in your terminal (I'll tell you when).

---

## Next Steps

Once you complete Steps 1-2 and share that you're ready, I'll:
1. Create the environment files
2. Guide you through Prisma installation
3. Run the database migrations
4. Test the connection

**Are you ready to create your Supabase project?** Let me know once you have your credentials!
