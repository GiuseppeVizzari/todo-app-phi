# Adding Auth0 Authentication to React Apps - A Teaching Guide

This guide explains how to add user authentication to your React application using Auth0, a popular authentication service. You'll learn the concepts, implementation steps, and best practices.

## What is Auth0?

Auth0 is an authentication and authorization platform that handles user login, signup, and security for your applications. Instead of building your own authentication system (which is complex and risky), you use Auth0's secure, tested solution.

**Benefits of Auth0:**
- ✅ Secure user authentication without writing security code
- ✅ Social login (Google, GitHub, Facebook, etc.)
- ✅ Multi-factor authentication (MFA)
- ✅ Password reset and email verification
- ✅ Free tier available (up to 7,000 users)
- ✅ Industry-standard security practices

**Use cases:**
- User accounts for your app
- Protecting certain pages/features
- Personalizing content per user
- Storing user-specific data

---

## How Auth0 Works

### The Authentication Flow

1. **User clicks "Log In"** in your app
2. **Redirect to Auth0** login page
3. **User enters credentials** (or uses social login)
4. **Auth0 verifies** the credentials
5. **Redirect back to your app** with authentication token
6. **Your app knows** who the user is

```
Your App → Auth0 Login Page → User Logs In → Auth0 → Your App (authenticated)
```

### Important Concepts

**Single Page Application (SPA)**
- Your React app is an SPA - it runs in the browser
- Auth0 has special SDK for SPAs

**Redirect URIs**
- Where Auth0 sends users after login
- Must be configured in Auth0 dashboard
- Example: `http://localhost:5173` for development

**Client ID and Domain**
- Unique identifiers for your Auth0 application
- Like a username and password for your app to talk to Auth0
- Never commit these to public repositories (use environment variables)

---

## Prerequisites

Before starting, you need:

1. **A React app** (Vite or Create React App)
2. **An Auth0 account** (free at [auth0.com](https://auth0.com))
3. **Node.js and npm** installed
4. **Basic React knowledge** (components, hooks, props)

---

## Part 1: Setting Up Auth0

### Step 1: Create an Auth0 Account

1. Go to [auth0.com](https://auth0.com)
2. Click **Sign Up**
3. Choose a method (email, Google, GitHub)
4. Complete the signup process

### Step 2: Create an Application

1. In the Auth0 Dashboard, click **Applications** → **Applications**
2. Click **Create Application**
3. Enter a name (e.g., "My Todo App")
4. Choose **Single Page Web Applications**
5. Select **React** as the technology
6. Click **Create**

### Step 3: Configure Application Settings

You'll see your application settings. Find these important values:

**Domain** (e.g., `dev-abc123.us.auth0.com`)
- This is your Auth0 tenant URL
- Copy this - you'll need it later

**Client ID** (e.g., `abc123xyz456...`)
- Unique identifier for your application
- Copy this - you'll need it later

Scroll down to **Application URIs** and configure:

**Allowed Callback URLs:**
```
http://localhost:5173
```

**Allowed Logout URLs:**
```
http://localhost:5173
```

**Allowed Web Origins:**
```
http://localhost:5173
```

**What are these?**
- **Callback URL**: Where Auth0 redirects after successful login
- **Logout URL**: Where Auth0 redirects after logout
- **Web Origins**: Which domains can make requests to Auth0

Click **Save Changes** at the bottom.

---

## Part 2: Installing Auth0 in Your React App

### Step 1: Install the Auth0 React SDK

Open your terminal in your project directory:

```bash
npm install @auth0/auth0-react
```

**What is this?**
- Official Auth0 library for React
- Provides hooks and components for authentication
- Handles all the complex OAuth flow for you

### Step 2: Create Environment Variables

Create a file named `.env.local` in your project root:

```env
VITE_AUTH0_DOMAIN=dev-abc123.us.auth0.com
VITE_AUTH0_CLIENT_ID=abc123xyz456...
```

**Replace** with your actual Domain and Client ID from Auth0 dashboard.

**Why `.env.local`?**
- Keeps secrets out of your code
- Different values for development/production
- Automatically ignored by Git (won't be committed)

**For Vite**: Variables must start with `VITE_`
**For Create React App**: Variables must start with `REACT_APP_`

### Step 3: Add `.env.local` to `.gitignore`

Make sure your `.gitignore` includes:

```
.env.local
```

This prevents accidentally committing your Auth0 credentials.

---

## Part 3: Implementing Authentication

### Step 1: Wrap Your App with Auth0Provider

Edit `src/main.jsx` (or `src/index.js` for Create React App):

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
```

**What's happening here?**
- `Auth0Provider` wraps your entire app
- Provides authentication context to all components
- `domain` and `clientId` come from environment variables
- `redirect_uri` tells Auth0 where to send users after login
- `window.location.origin` is `http://localhost:5173` in development

**For Create React App**, use:
```javascript
process.env.REACT_APP_AUTH0_DOMAIN
process.env.REACT_APP_AUTH0_CLIENT_ID
```

### Step 2: Create a Login Button Component

Create `src/components/LoginButton.jsx`:

```javascript
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function LoginButton() {
  const { loginWithRedirect } = useAuth0()

  return (
    <button onClick={() => loginWithRedirect()}>
      Log In
    </button>
  )
}

export default LoginButton
```

**Explanation:**
- `useAuth0()` is a hook that gives us Auth0 functions
- `loginWithRedirect()` redirects user to Auth0 login page
- When user logs in, Auth0 redirects back to your app

### Step 3: Create a Logout Button Component

Create `src/components/LogoutButton.jsx`:

```javascript
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function LogoutButton() {
  const { logout } = useAuth0()

  return (
    <button onClick={() => logout({ 
      logoutParams: { returnTo: window.location.origin } 
    })}>
      Log Out
    </button>
  )
}

export default LogoutButton
```

**Explanation:**
- `logout()` logs the user out
- `returnTo` specifies where to redirect after logout
- User goes back to your app's home page

### Step 4: Create a User Profile Component

Create `src/components/UserProfile.jsx`:

```javascript
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'

function UserProfile() {
  const { user, isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="user-profile">
      <img src={user.picture} alt={user.name} />
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  )
}

export default UserProfile
```

**Explanation:**
- `user` object contains user information (name, email, picture)
- `isAuthenticated` is `true` if user is logged in
- Only shows profile if user is authenticated

### Step 5: Update Your Main App Component

Edit `src/App.jsx`:

```javascript
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './components/LoginButton'
import UserProfile from './components/UserProfile'
import './App.css'

function App() {
  const { isLoading, isAuthenticated } = useAuth0()

  // Show loading while Auth0 initializes
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="app">
      <header>
        <h1>My App</h1>
        {isAuthenticated ? (
          <UserProfile />
        ) : (
          <LoginButton />
        )}
      </header>

      <main>
        {isAuthenticated ? (
          <div>
            <h2>Welcome! You are logged in.</h2>
            <p>This content is only visible to authenticated users.</p>
          </div>
        ) : (
          <div>
            <h2>Please log in to continue</h2>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
```

**Explanation:**
- `isLoading`: `true` while Auth0 is initializing (checking if user is logged in)
- `isAuthenticated`: `true` if user is logged in, `false` otherwise
- Show different content based on authentication status
- Conditional rendering: `{condition ? <ComponentA /> : <ComponentB />}`

---

## Part 4: Testing Your Authentication

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Test the Login Flow

1. Open `http://localhost:5173` in your browser
2. You should see the **Login** button
3. Click **Log In**
4. You'll be redirected to Auth0's login page
5. Click **Sign up** (first time) or enter credentials
6. After login, you'll be redirected back to your app
7. You should see your name, email, and **Logout** button

### Step 3: Test the Logout Flow

1. Click **Log Out**
2. You'll be logged out and redirected back
3. You should see the **Login** button again

---

## Part 5: User-Specific Data

Now let's make your app store different data for each user.

### The Problem

If you're using `localStorage` to save data, all users share the same data:

```javascript
// This is shared by everyone!
localStorage.setItem('todos', JSON.stringify(todos))
```

### The Solution

Use the user's ID to create separate storage keys:

```javascript
import { useAuth0 } from '@auth0/auth0-react'

function TodoApp() {
  const { user, isAuthenticated } = useAuth0()
  
  // Create user-specific key
  const userId = isAuthenticated ? user.sub : 'anonymous'
  const storageKey = `todos_${userId}`
  
  // Load todos for this specific user
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })
  
  // Save todos for this specific user
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos))
  }, [todos, storageKey])
  
  // Rest of your component...
}
```

**Explanation:**
- `user.sub` is a unique user ID from Auth0 (e.g., `auth0|123456`)
- Each user gets their own storage key: `todos_auth0|123456`
- Anonymous users use `todos_anonymous`
- Users can't see each other's data

---

## Part 6: Deploying with Auth0

When deploying to production (like GitHub Pages), you need to update your Auth0 configuration.

### Step 1: Update Auth0 Allowed URLs

In Auth0 Dashboard → Your Application → Settings:

**Allowed Callback URLs:**
```
http://localhost:5173, https://yourusername.github.io/your-repo/
```

**Allowed Logout URLs:**
```
http://localhost:5173, https://yourusername.github.io/your-repo/
```

**Allowed Web Origins:**
```
http://localhost:5173, https://yourusername.github.io/your-repo/
```

**Important**: Include **both** localhost (for development) and production URL.

### Step 2: Handle Production Environment Variables

**For GitHub Pages with GitHub Actions:**

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add two secrets:
   - Name: `VITE_AUTH0_DOMAIN`, Value: your Auth0 domain
   - Name: `VITE_AUTH0_CLIENT_ID`, Value: your Auth0 client ID

Update your GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
- name: Build app
  env:
    VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
    VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
  run: npm run build
```

### Step 3: Fix Redirect URI for GitHub Pages

If your app is at `https://username.github.io/repo/`, update `src/main.jsx`:

```javascript
<Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}
  clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
  authorizationParams={{
    redirect_uri: window.location.origin + import.meta.env.BASE_URL
  }}
>
```

**Why?**
- `window.location.origin` is `https://username.github.io`
- `import.meta.env.BASE_URL` is `/repo/` (from `vite.config.js`)
- Together: `https://username.github.io/repo/`

---

## Common Issues and Solutions

### Issue 1: "Callback URL mismatch" Error

**Error message:**
```
unauthorized_client: Callback URL mismatch
```

**Cause**: The URL Auth0 is redirecting to isn't in your allowed list.

**Solution:**
1. Check the exact URL in the error message
2. Add it to **Allowed Callback URLs** in Auth0 dashboard
3. Make sure to include trailing slashes if needed
4. Don't forget to click **Save Changes**

### Issue 2: "Invalid state" Error

**Cause**: Auth0 state parameter mismatch (usually from browser cache).

**Solution:**
1. Clear browser cache and cookies
2. Try in incognito/private window
3. Make sure you're not mixing localhost ports

### Issue 3: User Information Not Showing

**Cause**: Trying to access `user` before authentication completes.

**Solution:**
Always check `isAuthenticated` first:
```javascript
const { user, isAuthenticated } = useAuth0()

if (!isAuthenticated) {
  return <div>Please log in</div>
}

// Now safe to use user
return <div>Hello {user.name}</div>
```

### Issue 4: "Loading..." Never Completes

**Cause**: Missing or incorrect Auth0 credentials.

**Solution:**
1. Check `.env.local` exists and has correct values
2. Restart dev server after creating `.env.local`
3. Verify variable names start with `VITE_` (for Vite) or `REACT_APP_` (for CRA)

### Issue 5: Works Locally but Not in Production

**Cause**: Environment variables not configured in production.

**Solution:**
- For GitHub Pages: Add secrets in repository settings
- For Vercel/Netlify: Add environment variables in dashboard
- Make sure production URL is in Auth0 allowed URLs

---

## Security Best Practices

### 1. Never Commit Secrets

❌ **Don't do this:**
```javascript
const domain = "dev-abc123.us.auth0.com"  // Hardcoded!
```

✅ **Do this:**
```javascript
const domain = import.meta.env.VITE_AUTH0_DOMAIN
```

### 2. Use HTTPS in Production

Auth0 requires HTTPS for production. GitHub Pages provides this automatically.

### 3. Don't Store Sensitive Data in localStorage

Even with user-specific keys, localStorage is accessible in the browser. For sensitive data:
- Use a backend database
- Validate Auth0 tokens on the server
- Never trust client-side data

### 4. Validate on the Backend

If you have a backend API:
```javascript
// Frontend sends token
const { getAccessTokenSilently } = useAuth0()
const token = await getAccessTokenSilently()

fetch('/api/data', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// Backend validates token before returning data
```

### 5. Keep Dependencies Updated

```bash
npm update @auth0/auth0-react
```

Security patches are important!

---

## Advanced Features

### Social Login

In Auth0 Dashboard → **Authentication** → **Social**:

1. Click on a provider (Google, GitHub, Facebook)
2. Follow setup instructions
3. Enable the connection
4. Users can now log in with that provider!

No code changes needed - Auth0 handles it automatically.

### Multi-Factor Authentication (MFA)

In Auth0 Dashboard → **Security** → **Multi-factor Auth**:

1. Enable MFA
2. Choose factors (SMS, authenticator app, email)
3. Configure rules (always, or only for certain users)

Adds extra security layer to your app.

### Customizing the Login Page

In Auth0 Dashboard → **Branding** → **Universal Login**:

1. Customize colors, logo, background
2. Add custom CSS
3. Match your app's branding

---

## Complete Example: Todo App with Auth0

Here's a complete example putting it all together:

```javascript
// src/App.jsx
import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './components/LoginButton'
import LogoutButton from './components/LogoutButton'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  
  // User-specific storage key
  const userId = isAuthenticated ? user.sub : 'anonymous'
  const storageKey = `todos_${userId}`
  
  // Load todos from localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  })
  
  const [input, setInput] = useState('')
  
  // Save todos when they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos))
  }, [todos, storageKey])
  
  // Reset todos when user changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    setTodos(saved ? JSON.parse(saved) : [])
  }, [userId, storageKey])
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }])
      setInput('')
    }
  }
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <h1>Todo App</h1>
        <p>Please log in to access your todos</p>
        <LoginButton />
      </div>
    )
  }
  
  return (
    <div className="app">
      <header>
        <h1>My Todos</h1>
        <div className="user-info">
          <img src={user.picture} alt={user.name} />
          <span>{user.name}</span>
          <LogoutButton />
        </div>
      </header>
      
      <main>
        <div className="add-todo">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
          />
          <button onClick={addTodo}>Add</button>
        </div>
        
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id}>
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App
```

---

## Summary

### What You Learned

1. **Auth0 Basics**: What it is and why to use it
2. **Setup**: Creating Auth0 account and application
3. **Installation**: Adding Auth0 SDK to React
4. **Implementation**: Login, logout, user profile
5. **User-Specific Data**: Scoping data per user
6. **Deployment**: Production configuration
7. **Troubleshooting**: Common issues and solutions

### The Authentication Flow

```
1. User clicks "Log In"
2. Redirect to Auth0
3. User enters credentials
4. Auth0 verifies
5. Redirect back with token
6. App knows user identity
7. Show personalized content
```

### Key Takeaways

- ✅ Auth0 handles security for you
- ✅ Use environment variables for credentials
- ✅ Check `isAuthenticated` before accessing `user`
- ✅ Scope data per user with `user.sub`
- ✅ Update Auth0 URLs for production
- ✅ Never commit secrets to Git

---

## Next Steps

1. **Add Protected Routes**: Use React Router to protect certain pages
2. **Backend Integration**: Validate Auth0 tokens on your server
3. **Role-Based Access**: Give different permissions to different users
4. **Custom Claims**: Add custom data to user profiles
5. **Analytics**: Track user behavior with Auth0 logs

---

## Additional Resources

- [Auth0 React Quickstart](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Auth0 Community Forum](https://community.auth0.com)

---

## Practice Exercise

Build a simple app with Auth0:

1. Create a new React app
2. Add Auth0 authentication
3. Create a profile page showing user info
4. Add a protected "dashboard" page
5. Store user preferences in localStorage (scoped per user)
6. Deploy to GitHub Pages
7. Test with multiple user accounts

This hands-on practice will solidify your understanding of Auth0 authentication!
