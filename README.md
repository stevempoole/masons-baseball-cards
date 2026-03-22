# Mason's Baseball Card Collection

A private, password-protected website to showcase Mason's baseball card collection.

## Features

- 🔐 **Password Protection**: Simple password gate to keep the collection private
- 🚫 **Search Engine Blocked**: Robots.txt and noindex meta tags prevent indexing
- ⚾ **Beautiful Design**: Modern baseball-themed interface with green and gold colors
- 🔍 **Search & Filter**: Find cards by player name, team, or card number
- 📊 **Collection Stats**: See total cards, value, and unique teams
- 📱 **Mobile Responsive**: Works great on all devices
- 🖼️ **Image Support**: Display card images with fallback placeholders

## Setup Instructions

1. **Upload Your Spreadsheet Data**:
   - Replace the sample data in `script.js` with your actual card data
   - Your spreadsheet should have columns: Card Number, Player Name, Team, Market Value, Image URL
   - Use the `processSpreadsheetData()` function to convert CSV data

2. **Change Password**:
   - Edit `SITE_PASSWORD` in `script.js` (currently set to 'mason2026')

3. **Deploy to GitHub Pages**:
   - Push this repository to GitHub
   - Enable GitHub Pages in repository settings
   - Your site will be available at: `https://[username].github.io/masons-baseball-cards`

## Password

Current password: `mason` (simple and easy to remember!)

## Security Features

- Password protection (stored in sessionStorage)
- robots.txt blocks all search engines
- noindex, nofollow meta tags
- Private repository recommended

## File Structure

```
masons-baseball-cards/
├── index.html          # Main site structure
├── styles.css          # Beautiful styling
├── script.js           # Functionality and data
├── robots.txt          # Search engine blocking
└── README.md           # This file
```

## Customization

- Change colors in `styles.css` (currently green/gold baseball theme)
- Modify password in `script.js`
- Update card data structure as needed
- Add more sorting/filtering options

Built with ❤️ for Mason's collection!