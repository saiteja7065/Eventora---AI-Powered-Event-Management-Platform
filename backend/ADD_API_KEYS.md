# 🔐 API Keys Configuration Guide

## Step 1: Add Keys to Backend .env

Navigate to: `backend/.env`

Add the following lines at the end of the file:

```bash
# AI Services
GEMINI_API_KEY=AIzaSyBuv-exLTTjsoz70Iauxmd5wNPnHB3n8so
UNSPLASH_ACCESS_KEY=I87zl-Wfv7zlbSjT6SoxL9SQ175zuqEIHWFpUGBsMlo
```

## Step 2: Verify .gitignore

Make sure `backend/.env` is in your `.gitignore` file to prevent accidentally committing these keys to GitHub.

✅ This is already configured in your `.gitignore`

## Step 3: Restart Backend (if running)

If your backend server is running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C if running)
# Then restart:
npm run dev
```

## Security Notes

- ✅ `.env` files are gitignored - keys are safe
- ✅ Never share these keys publicly
- ✅ Never commit `.env` files to version control
- ✅ Use `.env.example` (without actual keys) for documentation

## Next Steps

Once the keys are added, you can proceed with:
1. Building the AI Event Generation API endpoint
2. Integrating Gemini API for event creation
3. Integrating Unsplash API for event images

---

**Your API Keys:**
- Gemini API Key: `AIzaSyBuv-exLTTjsoz70Iauxmd5wNPnHB3n8so`
- Unsplash Access Key: `I87zl-Wfv7zlbSjT6SoxL9SQ175zuqEIHWFpUGBsMlo`

*Note: Delete this file after adding the keys to .env*
