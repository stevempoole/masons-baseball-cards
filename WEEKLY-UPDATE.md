# 📊 Weekly Card Value Update Process

## Quick Start
```bash
cd ~/.openclaw/workspace/masons-baseball-cards
node update-from-sheet.js
```

## Process Overview

1. **Excel File**: Place updated card data in `~/Desktop/masons-cards-updated.xlsx`
   - Required columns: `number`, `name`, `team`, `front_image`, `market_value`
   - System automatically processes and validates the data

2. **Run Update**: Execute `node update-from-sheet.js`
   - Reads Excel file and converts to website format
   - Creates backup of current data
   - Updates `all-cards-data.js` with new values
   - Commits and pushes changes to GitHub

3. **Automatic Deployment**: GitHub Pages auto-deploys the updated website

## Expected Output
- ✅ Total cards processed and validated  
- ✅ Collection statistics (value, teams, highest card)
- ✅ Backup created of previous data
- ✅ Git commit and push to GitHub
- ✅ Website automatically updates via GitHub Pages

## Troubleshooting

**Excel file not found:**
- Ensure `masons-cards-updated.xlsx` exists on your Desktop (~Desktop/)
- Check that the filename matches exactly (case-sensitive)

**Git authentication issues:**
- Run `git remote set-url origin https://github.com/stevempoole/masons-baseball-cards.git`
- Use system Git credentials (already configured)

**Invalid data:**
- Cards without player names or teams are automatically filtered out
- Check Excel column headers match expected format

## Schedule
- **Frequency**: Weekly (Sundays at 9:00 AM EST)
- **Automation**: Can be triggered via OpenClaw cron jobs
- **Manual**: Run anytime with `node update-from-sheet.js`

## Files Generated
- `all-cards-data.js` - Main data file for website
- `all-cards-data.js.backup.[timestamp]` - Backup of previous data
- Git commit with collection statistics

---
**Current Status**: ✅ System operational and tested (April 12, 2026)