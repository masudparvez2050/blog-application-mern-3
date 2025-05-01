# Setting up Google OAuth in Your MERN Blog Application

This guide will help you set up Google OAuth authentication in your MERN blog application.

## Prerequisites

- A Google Cloud Console account
- Node.js and npm installed
- Your MERN application set up with Next.js frontend and Express backend

## Step 1: Set Up Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google OAuth2 API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google OAuth2"
   - Click "Enable"
4. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the application name, user support email, and developer contact information
   - Add necessary scopes (`profile` and `email`)
5. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Set authorized JavaScript origins (e.g., `http://localhost:3000` for development)
   - Set authorized redirect URIs (e.g., `http://localhost:3000/login`)
   - Copy your Client ID and Client Secret

## Step 2: Configure Environment Variables

### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 3: Install Required Dependencies

### Frontend
```bash
npm install @react-oauth/google
```

### Backend
```bash
npm install google-auth-library
```

## Step 4: Implementation Details

### Backend Setup
The backend already has the Google OAuth implementation in `authController.js`. It:
1. Verifies the Google token
2. Creates or updates user in the database
3. Returns JWT token for authentication

### Frontend Setup
1. Wrap your application with GoogleOAuthProvider in `app/layout.js`:
```javascript
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
```

2. Use the Google Login button in your login page (already implemented in `login/page.js`):
```javascript
import { GoogleLogin } from '@react-oauth/google';

// Inside your component
<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => setError("Google login failed")}
  useOneTap
/>
```

3. Handle the OAuth response using the `oauthLogin` function from `AuthContext` (already implemented):
```javascript
const handleGoogleLogin = async (credentialResponse) => {
  try {
    await oauthLogin("google", credentialResponse.credential);
    router.push('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
```

## Step 5: Testing

1. Start your backend server
2. Start your frontend application
3. Visit your login page
4. Click the "Continue with Google" button
5. Select a Google account and verify that:
   - You're successfully logged in
   - A new user is created in your database (for first-time users)
   - You're redirected to the dashboard
   - The user session persists after page refresh

## Common Issues and Solutions

1. **Invalid Client ID**
   - Double-check your Google Cloud Console credentials
   - Ensure the client ID is correctly set in environment variables
   - Verify authorized domains in Google Cloud Console

2. **Redirect URI Mismatch**
   - Add all possible redirect URIs in Google Cloud Console
   - Include both development and production URLs

3. **CORS Issues**
   - Ensure your backend CORS settings allow requests from your frontend origin
   - Check the API URL in frontend environment variables

4. **Token Verification Fails**
   - Verify that your backend has the correct Google client ID
   - Check if the token hasn't expired
   - Ensure proper error handling in the frontend

## Security Considerations

1. Always keep your Client Secret secure
2. Use environment variables for sensitive information
3. Implement proper JWT token handling
4. Validate user data on both frontend and backend
5. Use HTTPS in production
6. Implement proper session management

## Production Deployment

1. Update environment variables for production
2. Add production URLs to Google Cloud Console
3. Enable SSL for secure authentication
4. Test the OAuth flow in production environment

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://github.com/MomenSherif/react-oauth)
- [Next.js Authentication Documentation](https://nextjs.org/docs/authentication)
