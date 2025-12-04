# GitHub Pages Deployment - Quick Reference

## 🚀 Deployment Checklist

### Before First Deployment

- [ ] Push code to GitHub repository
- [ ] Add GitHub Secrets (Settings → Secrets and variables → Actions):
  - [ ] `VITE_AUTH0_DOMAIN`
  - [ ] `VITE_AUTH0_CLIENT_ID`
- [ ] Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Update Auth0 app with production URL:
  - [ ] Allowed Callback URLs: `https://GiuseppeVizzari.github.io/todo-app-phi/`
  - [ ] Allowed Logout URLs: `https://GiuseppeVizzari.github.io/todo-app-phi/`
  - [ ] Allowed Web Origins: `https://GiuseppeVizzari.github.io/todo-app-phi/`

### Deploy

```bash
git push origin main
```

### After Deployment

- [ ] Check Actions tab for workflow status
- [ ] Visit: https://GiuseppeVizzari.github.io/todo-app-phi/
- [ ] Test login flow
- [ ] Test todo operations
- [ ] Test logout flow

## 📁 Files Changed for Deployment

| File | Purpose |
|------|---------|
| `vite.config.js` | Added `base: '/todo-app-phi/'` for GitHub Pages |
| `.github/workflows/deploy.yml` | Automated deployment workflow |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `.env.example` | Updated with production notes |

## 🔗 Important URLs

- **Production App**: https://GiuseppeVizzari.github.io/todo-app-phi/
- **GitHub Actions**: https://github.com/GiuseppeVizzari/todo-app-phi/actions
- **Auth0 Dashboard**: https://manage.auth0.com

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 Page Not Found | Enable GitHub Pages in Settings → Pages |
| Blank page / assets not loading | Check `base` in vite.config.js matches repo name |
| Auth0 redirect error | Add production URL to Auth0 allowed URLs |
| "Loading..." never completes | Add GitHub Secrets for Auth0 credentials |

See [DEPLOYMENT.md](file:///Users/viz/WebstormProjects/todo-app-phi/DEPLOYMENT.md) for full documentation.
