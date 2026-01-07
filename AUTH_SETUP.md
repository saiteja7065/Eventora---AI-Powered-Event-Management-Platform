# Supabase Authentication Setup Guide

## Step 1: Enable Email Authentication

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your `Eventora` project
3. Click **Authentication** in the left sidebar
4. Click **Providers**
5. Under **"Email"**, click to expand
6. Make sure **"Enable Email provider"** is toggled ON
7. **Important**: Toggle **"Confirm email"** to OFF for testing (turn it ON in production)
8. Click **Save**

---

## Step 2: Enable OAuth Providers (GitHub & Google)

### Enable GitHub OAuth:

1. In Supabase Authentication → Providers
2. Find and expand **"GitHub"**
3. Toggle **"Enable Sign in with GitHub"** to ON

4. **Get GitHub OAuth credentials**:
   - Go to https://github.com/settings/developers
   - Click **"New OAuth App"**
   - Fill in:
     - Application name: `Eventora`
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: Copy from Supabase (shown in the GitHub provider settings)
   - Click **"Register application"**
   - Copy the **Client ID** and **Client Secret**

5. **Add to Supabase**:
   - Paste **Client ID** in Supabase
   - Paste **Client Secret** in Supabase
   - Click **Save**

---

### Enable Google OAuth:

1. In Supabase Authentication → Providers
2. Find and expand **"Google"**
3. Toggle **"Enable Sign in with Google"** to ON

4. **Get Google OAuth credentials**:
   - Go to https://console.cloud.google.com
   - Create a new project (or select existing)
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Configure consent screen if prompted
   - Application type: **Web application**
   - Name: `Eventora`
   - Authorized redirect URIs: Copy from Supabase (shown in the Google provider settings)
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

5. **Add to Supabase**:
   - Paste **Client ID** in Supabase
   - Paste **Client Secret** in Supabase
   - Click **Save**

---

## Step 3: Install Required Package

Run this command:

```bash
cd frontend
npm install @supabase/ssr
cd ..
```

---

## Step 4: Test Authentication

1. Go to `http://localhost:3000/register`
2. Create an account with email/password
3. Check Supabase Dashboard → Authentication → Users to see the new user
4. Try logging in at `http://localhost:3000/login`
5. Test social login buttons (they should open OAuth flows)

---

## Troubleshooting

**Email signup not working?**
- Make sure "Confirm email" is OFF in Supabase for testing
- Check browser console for errors
- Verify environment variables in `.env.local`

**OAuth not working?**
- Verify callback URLs match exactly in GitHub/Google
- Check that providers are enabled in Supabase
- Make sure you're on `http://localhost:3000` (not 127.0.0.1)

**Pages not loading?**
- Make sure `@supabase/ssr` is installed
- Check that AuthProvider is wrapping the app in `layout.tsx`
- Restart dev server after installing packages
