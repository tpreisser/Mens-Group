# Same Battles - Men's Bible Study PWA

## Project Overview
A 12-week men's Bible study Progressive Web App. Static HTML/CSS/JS, deployed via GitHub Pages.

## Tech Stack
- Static HTML5 + CSS3 + Vanilla JavaScript
- PWA with Service Worker (offline support)
- GitHub Pages deployment (main branch, auto-deploys)
- Fonts: Oswald (headings) + Inter (body) via Google Fonts

## Repository
- Remote: https://github.com/tpreisser/Mens-Group.git
- Live: https://tpreisser.github.io/Mens-Group/

## Project Structure
- `index.html` - Homepage with 12 week card grid
- `weeks/week-01.html` through `weeks/week-12.html` - Individual week pages
- `css/styles.css` - All styles (mobile-first, dark theme)
- `js/app.js` - Navigation, audio player, accordion logic
- `sw.js` - Service worker (versioned cache)
- `manifest.json` - PWA manifest
- `images/` - Week promotional images (PNG + WebP)
- `audio/` - Weekly teaching audio (M4A)
- `logo/` - Branding assets + PWA icons
- `Characters:Context Markdown Weekly files/` - Source markdown for pre-reading content

## Design System
- Primary Dark: #1a1a1a
- Secondary Dark: #2d2d2d
- Accent Gold: #c9a227
- Text Primary: #f5f5f5
- Text Secondary: #a0a0a0

## Week Page Structure
Each week page contains (in order):
1. Header with back button + logo
2. Week image
3. Pre-Reading Context (collapsible) - Characters + Context
4. Scripture Reading (collapsible) - ESV text
5. Discussion Questions - Open-ended, conversational questions
6. Audio player

## Content Guidelines
- Discussion questions should be open-ended and conversational
- No leading biblical statements before questions - the Scripture section provides that context
- Questions should feel like a friend asking over coffee, not a study guide
- Use natural, human tone with "you" language
- Questions address the human experience directly

## Deployment
1. Push to `main` branch
2. GitHub Pages auto-deploys from root of main
3. To force cache refresh: increment version in sw.js `CACHE_NAME`

## Cache Busting
- Service worker cache name: `same-battles-v{N}` in sw.js
- Increment version number to bust browser caches
- Old caches auto-deleted on service worker activation
