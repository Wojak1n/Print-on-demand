# Environment Variables Setup Guide

This guide will help you set up the environment variables for the KHAYALI Print-on-Demand platform.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

3. **Update the `.env` file:**
   - Open `.env` in your text editor
   - Replace `your_gemini_api_key_here` with your actual API key
   - Save the file

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Required Environment Variables

### GEMINI_API_KEY (Required)

The Google Gemini API key is **required** for the AI design generation features.

**How to get it:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it in your `.env` file:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

**Features that use this API:**
- AI-powered design generation in the Design Studio
- Automatic marketing copy generation in the Admin panel
- SVG design creation from text prompts

## Optional Environment Variables

### Application Configuration

```env
VITE_APP_NAME=KHAYALI                    # Your app name
VITE_APP_URL=http://localhost:3000       # Your app URL
VITE_ENV=development                     # Environment: development, staging, production
```

### Feature Flags

```env
VITE_ENABLE_AI_GENERATION=true           # Enable/disable AI features
VITE_ENABLE_ADMIN_PANEL=true             # Enable/disable admin panel
VITE_ENABLE_REGISTRATION=true            # Enable/disable user registration
```

### Social Media Links

```env
VITE_INSTAGRAM_URL=https://instagram.com/khayali
VITE_TWITTER_URL=https://twitter.com/khayali
VITE_FACEBOOK_URL=https://facebook.com/khayali
```

### Contact Information

```env
VITE_SUPPORT_EMAIL=support@khayali.com   # Support email address
```

## Environment Variables for Production (Vercel)

When deploying to Vercel, you need to add environment variables in the Vercel dashboard:

1. Go to your project on [Vercel](https://vercel.com)
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
| `VITE_APP_URL` | Your production URL | Production |
| `VITE_ENV` | `production` | Production |

**Important:** Make sure to select the appropriate environments (Production, Preview, Development) for each variable.

## Troubleshooting

### AI Features Not Working

**Problem:** AI design generation or marketing copy generation fails

**Solution:**
1. Check that `GEMINI_API_KEY` is set in your `.env` file
2. Verify the API key is valid (no extra spaces, complete key)
3. Check the browser console for error messages
4. Ensure you have API quota remaining in Google AI Studio

### Environment Variables Not Loading

**Problem:** Changes to `.env` file are not reflected in the app

**Solution:**
1. Restart the development server (`Ctrl+C` then `npm run dev`)
2. Clear browser cache and hard refresh (`Ctrl+Shift+R`)
3. Check that the variable name starts with `VITE_` (required for Vite)
4. Verify the `.env` file is in the root directory

### Vercel Deployment Issues

**Problem:** App works locally but not on Vercel

**Solution:**
1. Check that all environment variables are added in Vercel dashboard
2. Verify the variable names match exactly (case-sensitive)
3. Redeploy after adding/updating environment variables
4. Check Vercel deployment logs for errors

## Security Best Practices

1. **Never commit `.env` to version control**
   - The `.gitignore` file already excludes `.env`
   - Always use `.env.example` as a template

2. **Use different API keys for development and production**
   - Create separate API keys for each environment
   - Rotate keys regularly

3. **Limit API key permissions**
   - Only grant necessary permissions to API keys
   - Monitor API usage in Google AI Studio

4. **Keep secrets secret**
   - Don't share API keys in screenshots, videos, or documentation
   - Don't hardcode secrets in your code

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Google AI Studio](https://aistudio.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter any issues with environment setup, please:
- Check the troubleshooting section above
- Review the [main README](./README.md)
- Contact support at support@khayali.com

