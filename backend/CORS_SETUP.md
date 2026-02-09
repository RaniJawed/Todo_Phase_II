# CORS Configuration for Production

## Environment Variables

To allow your Vercel frontend to communicate with your HuggingFace backend, you need to set the following environment variable in your HuggingFace Space:

### ALLOWED_ORIGINS

Set this to your Vercel deployment URL(s), separated by commas if you have multiple:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### ENVIRONMENT

Set this to "production" to enable cross-domain cookie support:

```
ENVIRONMENT=production
```

## Example Configuration

If your Vercel app is deployed at `https://your-app.vercel.app`, set:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
ENVIRONMENT=production
```

## How to Set Environment Variables in HuggingFace Spaces

1. Go to your HuggingFace Space settings
2. Navigate to "Variables and secrets"
3. Add the environment variables:
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app`
   - `ENVIRONMENT` = `production`

## Notes

- The backend will automatically allow `http://localhost:3000` for local development
- Cookies are configured to work cross-domain when `ENVIRONMENT=production`
- Make sure your Vercel deployment URL matches exactly (including https://)

