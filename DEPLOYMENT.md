# 🚀 Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** button in top right, then **"New repository"**
3. Repository name: `masons-baseball-cards`
4. Description: `Mason's private baseball card collection`
5. Set to **Private** (recommended for password-protected sites)
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. Click **"Create repository"**

## Step 2: Push Your Code

The repository is already set up locally. Just run:

```bash
cd ~/.openclaw/workspace/masons-baseball-cards
git push -u origin main
```

If you get authentication errors, you may need to set up a GitHub personal access token.

## Step 3: Enable GitHub Pages

1. Go to your new repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section in left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Branch: **main**, Folder: **/ (root)**
6. Click **Save**
7. GitHub will provide your site URL: `https://stevempoole.github.io/masons-baseball-cards`

## Step 4: Add Your Card Data

1. Open your baseball card spreadsheet
2. Make sure it has these columns:
   - **Card Number** (e.g., "2021-1", "RC-150")
   - **Player Name** (e.g., "Mike Trout")
   - **Team** (e.g., "Los Angeles Angels")
   - **Market Value** (number, e.g., 450.00)
   - **Image URL** (link to card image)

3. Export as CSV or copy the data
4. Replace the sample data in `script.js`:
   - Find the `sampleCards` array
   - Replace with your actual card data
   - Or use the `processSpreadsheetData()` function for CSV import

## Step 5: Customize (Optional)

- **Change Password**: Edit `SITE_PASSWORD` in `script.js` (currently 'mason613')
- **Update Colors**: Modify colors in `styles.css`
- **Add More Cards**: Update the data array in `script.js`

## 🔐 Current Settings

- **Password**: `mason613` (represents the 613 cards in Mason's collection!)
- **Search Engine Blocking**: ✅ Enabled (robots.txt + noindex)
- **Mobile Responsive**: ✅ Enabled
- **Password Protection**: ✅ Session-based

## 🎯 Final URL

Once deployed: `https://stevempoole.github.io/masons-baseball-cards`

The site will be live within 5-10 minutes of enabling GitHub Pages!