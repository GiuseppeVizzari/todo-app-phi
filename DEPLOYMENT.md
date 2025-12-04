# Deploying to GitHub Pages

This guide walks you through deploying your Auth0-enabled todo app to GitHub Pages.

## Prerequisites

- GitHub repository with your code
- Auth0 application configured
- Auth0 credentials (Domain and Client ID)

## Deployment URL

Your app will be available at:
```
https://GiuseppeVizzari.github.io/todo-app-phi/
```

## Step-by-Step Deployment

### 1. Configure GitHub Secrets

Your Auth0 credentials need to be stored as GitHub Secrets (not in code for security).

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

**Secret 1:**
- Name: `VITE_AUTH0_DOMAIN`
- Value: Your Auth0 domain (e.g., `dev-abc123.us.auth0.com`)

**Secret 2:**
- Name: `VITE_AUTH0_CLIENT_ID`
- Value: Your Auth0 client ID (e.g., `abc123xyz456...`)

> [!IMPORTANT]
> These secrets are injected during the build process and are NOT exposed in your code or browser.

### 2. Update Auth0 Application Settings

Add your production URL to Auth0:

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Navigate to **Applications** → Your Application
3. Scroll to **Application URIs**
4. Add to **Allowed Callback URLs**:
   ```
   http://localhost:5173, https://GiuseppeVizzari.github.io/todo-app-phi/
   ```
5. Add to **Allowed Logout URLs**:
   ```
   http://localhost:5173, https://GiuseppeVizzari.github.io/todo-app-phi/
   ```
6. Add to **Allowed Web Origins**:
   ```
   http://localhost:5173, https://GiuseppeVizzari.github.io/todo-app-phi/
   ```
7. Click **Save Changes**

> [!TIP]
> Keep both localhost and production URLs so you can develop locally and deploy to production.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 4. Deploy Your App

Simply push your code to the `main` branch:

```bash
# Make sure all changes are committed
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Install dependencies
2. Build your app with Auth0 credentials
3. Deploy to GitHub Pages

### 5. Monitor Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see the "Deploy to GitHub Pages" workflow running
4. Wait for it to complete (usually 1-2 minutes)
5. ✅ Green checkmark = successful deployment

### 6. Test Your Deployed App

1. Visit: `https://GiuseppeVizzari.github.io/todo-app-phi/`
2. You should see the login screen
3. Click **Log In**
4. Authenticate with Auth0
5. You should be redirected back to your app
6. Create some todos and verify everything works!

## Automatic Deployments

Every time you push to the `main` branch, your app will automatically rebuild and redeploy. No manual steps needed!

## Troubleshooting

### Issue: 404 Page Not Found

**Cause:** GitHub Pages not enabled or deployment failed

**Solution:**
1. Check Settings → Pages is set to "GitHub Actions"
2. Check Actions tab for failed workflows
3. Review workflow logs for errors

### Issue: Assets not loading (blank page)

**Cause:** Incorrect base URL in `vite.config.js`

**Solution:**
- Verify `base: '/todo-app-phi/'` matches your repository name exactly
- Repository name is case-sensitive

### Issue: Auth0 redirect error

**Cause:** Production URL not added to Auth0

**Solution:**
- Verify you added the GitHub Pages URL to Auth0 settings
- Check for typos in the URL
- Make sure to include the trailing slash

### Issue: "Loading..." never completes

**Cause:** GitHub Secrets not configured

**Solution:**
1. Verify secrets are added in Settings → Secrets and variables → Actions
2. Secret names must be EXACTLY: `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`
3. Re-run the workflow after adding secrets

### Issue: Workflow fails with "npm ci" error

**Cause:** package-lock.json out of sync

**Solution:**
```bash
# Regenerate package-lock.json
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

## Viewing Workflow Logs

If deployment fails:

1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click on the failed job (build or deploy)
4. Expand the failed step to see error details

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the app locally
npm run build

# The dist/ folder contains your built app
# You can manually upload this to any static hosting service
```

## Production vs Development

| Environment | Auth0 Config | URL |
|-------------|--------------|-----|
| **Development** | `.env.local` file | `http://localhost:5173` |
| **Production** | GitHub Secrets | `https://GiuseppeVizzari.github.io/todo-app-phi/` |

Both environments use the same Auth0 application, just with different redirect URLs.

## Security Notes

✅ **Secure:**
- Auth0 credentials stored as GitHub Secrets
- Secrets only accessible during build
- HTTPS enforced by GitHub Pages

⚠️ **Remember:**
- Todos still stored in browser localStorage
- For production apps with sensitive data, use a backend database

## Next Steps

### Custom Domain (Optional)

Want to use your own domain instead of `github.io`?

1. Go to Settings → Pages
2. Add your custom domain
3. Update DNS records
4. Update Auth0 URLs to use custom domain

### Backend Integration

To move beyond localStorage:

1. Set up a backend (Supabase, Firebase, etc.)
2. Use the `TodoService.js` layer for API calls
3. Add Auth0 token validation on backend
4. Store todos in database

## Support

If you encounter issues:

1. Check the [walkthrough.md](file:///Users/viz/.gemini/antigravity/brain/07e7e12a-0951-4b7e-b338-5d1160ba2471/walkthrough.md) for detailed architecture info
2. Review GitHub Actions logs
3. Check Auth0 dashboard logs
4. Verify all URLs match exactly (including trailing slashes)

---

**Deployment URL:** https://GiuseppeVizzari.github.io/todo-app-phi/

**Status:** Ready to deploy! Just push to `main` branch.
