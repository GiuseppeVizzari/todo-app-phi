# Deploying React Apps to GitHub Pages - A Teaching Guide

This guide explains two methods for deploying React applications to GitHub Pages. Both methods are commonly used, and understanding both will help you choose the right approach for your projects.

## What is GitHub Pages?

GitHub Pages is a free hosting service provided by GitHub that lets you publish websites directly from your GitHub repository. It's perfect for:
- Personal portfolios
- Project documentation
- Demo applications
- Static websites

**Important**: GitHub Pages only hosts **static** websites (HTML, CSS, JavaScript). It cannot run server-side code.

---

## Prerequisites

Before deploying, make sure you have:

1. **A React app** (created with Vite, Create React App, or similar)
2. **A GitHub account**
3. **Git installed** on your computer
4. **Your code in a GitHub repository**

---

## Understanding the URL Structure

Your deployed app will be available at:
```
https://<username>.github.io/<repository-name>/
```

For example:
- Username: `john-doe`
- Repository: `my-todo-app`
- URL: `https://john-doe.github.io/my-todo-app/`

**Special case**: If your repository is named `<username>.github.io`, the app will be at `https://<username>.github.io/` (without the repository name).

---

## Method 1: Using the `gh-pages` Branch (Traditional Method)

This is the older, manual method. It's good to understand because many tutorials still use it.

### How It Works

1. You build your React app locally (creates a `dist` or `build` folder)
2. You push the built files to a special branch called `gh-pages`
3. GitHub Pages serves the files from that branch

### Step-by-Step Instructions

#### Step 1: Install the `gh-pages` Package

This package helps automate deployment to the `gh-pages` branch.

```bash
npm install --save-dev gh-pages
```

#### Step 2: Configure Your Build Tool

**For Vite projects**, edit `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-todo-app/',  // Replace with YOUR repository name
})
```

**For Create React App**, edit `package.json` and add:

```json
{
  "homepage": "https://john-doe.github.io/my-todo-app/"
}
```

**Why?** Because your app isn't at the root URL (`/`), it's at `/my-todo-app/`. This tells your build tool where to find assets (CSS, JS, images).

#### Step 3: Add Deployment Scripts

Edit `package.json` and add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Explanation:**
- `predeploy`: Runs automatically before `deploy`. It builds your app.
- `deploy`: Pushes the `dist` folder to the `gh-pages` branch.

**Note**: For Create React App, use `-d build` instead of `-d dist`.

#### Step 4: Deploy Your App

Run this command:

```bash
npm run deploy
```

**What happens:**
1. `predeploy` runs → builds your app → creates `dist` folder
2. `deploy` runs → creates `gh-pages` branch → pushes `dist` contents to it
3. GitHub automatically detects the `gh-pages` branch

#### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

#### Step 6: Wait and Visit

- GitHub takes 1-2 minutes to build and deploy
- Visit `https://<username>.github.io/<repository-name>/`
- Your app should be live!

### Updating Your App

Whenever you make changes:

```bash
npm run deploy
```

This rebuilds and redeploys automatically.

### Pros and Cons of This Method

**Pros:**
✅ Simple to understand
✅ Works with any build tool
✅ Full control over deployment timing

**Cons:**
❌ Manual deployment (must run command each time)
❌ Requires `gh-pages` package
❌ Creates an extra branch in your repository
❌ Build files are committed to Git (not ideal)

---

## Method 2: Using GitHub Actions (Modern Method)

This is the newer, automated method. It's what we use in this project.

### How It Works

1. You push code to the `main` branch
2. GitHub Actions automatically builds your app
3. GitHub Actions deploys the built files to GitHub Pages
4. No manual deployment needed!

### Step-by-Step Instructions

#### Step 1: Configure Your Build Tool

Same as Method 1 - edit `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-todo-app/',  // Replace with YOUR repository name
})
```

#### Step 2: Create a GitHub Actions Workflow

Create this file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  # Runs when you push to main branch
  push:
    branches: ["main"]
  
  # Allows manual deployment from Actions tab
  workflow_dispatch:

# Permissions needed for deployment
permissions:
  contents: read
  pages: write
  id-token: write

# Prevent multiple deployments at once
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload build files
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  # Deploy job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Let's break this down:**

**`on: push: branches: ["main"]`**
- Triggers the workflow when you push to `main`

**`permissions:`**
- Gives the workflow permission to deploy to GitHub Pages

**`jobs: build:`**
- Checks out your code
- Installs Node.js
- Installs dependencies with `npm ci` (faster than `npm install`)
- Builds your app with `npm run build`
- Uploads the `dist` folder

**`jobs: deploy:`**
- Runs after `build` completes
- Deploys the uploaded files to GitHub Pages

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **GitHub Actions** (not a branch!)
4. Click **Save**

#### Step 4: Push Your Code

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

#### Step 5: Monitor Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see "Deploy to GitHub Pages" running
4. Wait for the green checkmark ✅ (usually 1-2 minutes)

#### Step 6: Visit Your App

Go to `https://<username>.github.io/<repository-name>/`

### Updating Your App

Just push to `main`:

```bash
git add .
git commit -m "Update app"
git push origin main
```

GitHub Actions automatically rebuilds and redeploys!

### Pros and Cons of This Method

**Pros:**
✅ Fully automated - just push code
✅ No extra packages needed
✅ No `gh-pages` branch cluttering your repo
✅ Build files never committed to Git
✅ Can see deployment status in Actions tab
✅ Can add tests, linting, etc. to workflow
✅ Industry standard for modern projects

**Cons:**
❌ Slightly more complex setup
❌ Requires understanding of YAML
❌ Debugging workflow issues can be tricky

---

## Comparison Table

| Feature | gh-pages Branch | GitHub Actions |
|---------|----------------|----------------|
| **Setup Complexity** | Simple | Medium |
| **Deployment** | Manual command | Automatic on push |
| **Extra Dependencies** | Yes (`gh-pages`) | No |
| **Extra Branch** | Yes (`gh-pages`) | No |
| **Build Files in Git** | Yes | No |
| **CI/CD Integration** | No | Yes |
| **Deployment Visibility** | No | Yes (Actions tab) |
| **Modern Best Practice** | No | Yes |

---

## Common Issues and Solutions

### Issue 1: Blank Page After Deployment

**Cause**: Incorrect `base` configuration

**Solution**: 
- Check `vite.config.js` has correct repository name
- Repository name is case-sensitive
- Must include slashes: `base: '/repo-name/'`

### Issue 2: 404 on Page Refresh

**Cause**: React Router trying to use browser routing on a static host

**Solution**: 
- Use hash routing: `<HashRouter>` instead of `<BrowserRouter>`
- Or add a custom 404.html that redirects to index.html

### Issue 3: Assets Not Loading (404 errors)

**Cause**: Assets looking in wrong directory

**Solution**:
- Verify `base` in `vite.config.js` matches repository name exactly
- Check browser console for the exact URLs being requested

### Issue 4: GitHub Actions Workflow Fails

**Cause**: Various (permissions, Node version, etc.)

**Solution**:
1. Click on the failed workflow in Actions tab
2. Read the error message
3. Common fixes:
   - Enable Pages in Settings → Pages
   - Check Node version matches your local version
   - Verify `package-lock.json` is committed

### Issue 5: Changes Not Showing Up

**Cause**: Browser cache or GitHub Pages cache

**Solution**:
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Wait a few minutes for GitHub's CDN to update

---

## Environment Variables

If your app uses environment variables (like API keys):

### For gh-pages Method:

Create `.env.production`:
```
VITE_API_KEY=your-key-here
```

**Warning**: These will be visible in your built code! Never put secrets here.

### For GitHub Actions Method:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add your variables

Update workflow:
```yaml
- name: Build app
  env:
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
  run: npm run build
```

**Note**: Still visible in built code, but not in your repository.

---

## Best Practices

1. **Always use HTTPS**: GitHub Pages provides free HTTPS
2. **Test locally first**: Run `npm run build` and `npm run preview` before deploying
3. **Use meaningful commit messages**: Helps track what changed when
4. **Add a README**: Explain what your project does and how to run it
5. **Include a .gitignore**: Don't commit `node_modules`, `dist`, or `.env.local`
6. **Check mobile responsiveness**: GitHub Pages is public, test on different devices

---

## Which Method Should You Use?

**Use gh-pages branch if:**
- You're learning and want something simple
- You have a small project
- You want full control over when to deploy
- You're following an older tutorial

**Use GitHub Actions if:**
- You're building a professional project
- You want automatic deployments
- You want to add tests or other CI/CD steps
- You're learning modern development practices

**For this course**: We recommend starting with the `gh-pages` method to understand the basics, then moving to GitHub Actions for real projects.

---

## Summary

**gh-pages Branch Method:**
1. Install `gh-pages` package
2. Configure `base` in build tool
3. Add deploy scripts to `package.json`
4. Run `npm run deploy`
5. Enable Pages in GitHub settings

**GitHub Actions Method:**
1. Configure `base` in build tool
2. Create `.github/workflows/deploy.yml`
3. Enable Pages (select "GitHub Actions")
4. Push to `main` branch
5. Deployment happens automatically

Both methods achieve the same result - your React app hosted on GitHub Pages. The difference is in **how** you deploy: manually vs. automatically.

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Router Hash Router](https://reactrouter.com/en/main/router-components/hash-router)

---

## Practice Exercise

Try deploying a simple React app using both methods:

1. Create a new React app with Vite
2. Deploy it using the `gh-pages` method
3. Remove the `gh-pages` branch
4. Deploy the same app using GitHub Actions
5. Compare the experience

This hands-on practice will solidify your understanding of both approaches!
