# Auth0 Authentication Setup

This todo app now includes Auth0 authentication! Follow these steps to get started.

## Quick Start

### 1. Install Dependencies

```bash
npm install @auth0/auth0-react
```

### 2. Create Auth0 Account & Application

1. Go to [auth0.com](https://auth0.com) and sign up (free tier available)
2. Create a new **Single Page Application**
3. Choose **React** as the technology

### 3. Configure Auth0 Application

In your Auth0 application settings, add these URLs:

- **Allowed Callback URLs**: `http://localhost:5173`
- **Allowed Logout URLs**: `http://localhost:5173`
- **Allowed Web Origins**: `http://localhost:5173`

### 4. Get Your Credentials

From the Auth0 dashboard, copy:
- **Domain** (e.g., `dev-abc123.us.auth0.com`)
- **Client ID** (e.g., `abc123xyz456...`)

### 5. Create Environment File

Create a file named `.env.local` in the project root:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

Replace with your actual Auth0 credentials.

### 6. Start the App

```bash
npm run dev
```

Open `http://localhost:5173` and click "Log In"!

## What's New

- 🔐 **Secure Authentication** - Login with Auth0
- 👤 **User Profiles** - See your name and avatar
- 🔒 **Data Isolation** - Each user has their own todos
- 💾 **Persistent Sessions** - Stay logged in across browser sessions

## Features

### User-Scoped Todos
Each authenticated user has their own isolated todo list. Your todos are stored with your user ID, so they won't mix with other users' data.

### Secure & Private
Authentication is handled by Auth0, an industry-leading identity platform. Your credentials are never stored in this application.

### MVVM Architecture
The integration maintains the existing Model-View-ViewModel pattern with clean separation of concerns.

## Need Help?

See the [walkthrough documentation](file:///Users/viz/.gemini/antigravity/brain/07e7e12a-0951-4b7e-b338-5d1160ba2471/walkthrough.md) for detailed information about architecture, testing procedures, and troubleshooting.

## Production Deployment (GitHub Pages)

Ready to deploy your app to the web?

### Quick Deployment Steps

1. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
   - `VITE_AUTH0_DOMAIN` = your Auth0 domain
   - `VITE_AUTH0_CLIENT_ID` = your Auth0 client ID

2. **Update Auth0 Application** (add production URL):
   - Allowed Callback URLs: `https://GiuseppeVizzari.github.io/todo-app-phi/`
   - Allowed Logout URLs: `https://GiuseppeVizzari.github.io/todo-app-phi/`
   - Allowed Web Origins: `https://GiuseppeVizzari.github.io/todo-app-phi/`

3. **Enable GitHub Pages** (Settings → Pages):
   - Source: GitHub Actions

4. **Deploy**:
   ```bash
   git push origin main
   ```

See [DEPLOYMENT.md](file:///Users/viz/WebstormProjects/todo-app-phi/DEPLOYMENT.md) for detailed deployment instructions.

## Files Changed

- `src/main.jsx` - Added Auth0Provider
- `src/view/App.jsx` - Authentication state handling
- `src/view/LoginButton.jsx` - New login component
- `src/view/LogoutButton.jsx` - New logout component
- `src/view/UserProfile.jsx` - New user profile component
- `src/viewmodel/useTodoViewModel.js` - User-scoped data
- `src/view/App.css` - Authentication UI styles
- `.env.example` - Environment variable template

## Production Deployment

For production use, remember to:
1. Add your production URL to Auth0 allowed URLs
2. Update `.env.local` or use environment variables
3. Consider adding a backend database for server-side storage
