# Deployment to GitHub Pages — Setup Guide

## Step 1: Create GitHub Repository (One-time setup)

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository with these settings:
   - **Repository name**: `lakshima-portfolio`
   - **Description**: Personal portfolio website
   - **Visibility**: Public (required for GitHub Pages)
   - **Do NOT initialize with README, .gitignore, or license**
3. Click **Create repository**

## Step 2: Connect Local Repository to GitHub

Once you've created the repository on GitHub, run this command in the terminal:

```powershell
git remote add origin https://github.com/Lakshima409/lakshima-portfolio.git
git branch -M main
git push -u origin main
```

This will:
- Connect your local repo to GitHub
- Rename the branch to `main` (if needed)
- Push all files to GitHub

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Lakshima409/lakshima-portfolio`
2. Click **Settings** (top right)
3. Scroll to **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select **Deploy from a branch**
   - **Branch**: Select `main` and folder `/root`
5. Click **Save**
6. Wait 1-2 minutes for the site to build
7. Your portfolio will be live at: **https://lakshima409.github.io/lakshima-portfolio**

## Step 4: Update Portfolio After Changes

After making changes locally, push them to GitHub:

```powershell
git add .
git commit -m "Update portfolio content"
git push
```

Changes typically appear within 1-2 minutes.

---

## Troubleshooting

- **"Repository not found"**: Make sure you created the repository on GitHub first
- **Pages not showing**: Verify Settings > Pages is configured correctly
- **Old content showing**: Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+Shift+R)

---

## Your Portfolio Details

- **Repository URL**: https://github.com/Lakshima409/lakshima-portfolio
- **Live Site URL**: https://lakshima409.github.io/lakshima-portfolio
- **Contact Email**: mhlakshima@gmail.com
