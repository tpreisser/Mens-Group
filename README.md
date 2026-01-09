# Same Battles - Men's Bible Study Web App

A mobile-first, progressive web app for a 12-week men's Bible study series called "Same Battles." Built with clean, professional design optimized for iPhone and Android devices.

## Features

- 📱 **Mobile-First Design** - Optimized for iPhone and Android
- 🎨 **Professional Aesthetic** - Clean, masculine design (not churchy)
- 🎧 **Audio Player** - Custom-styled audio player for weekly teachings
- 📖 **12 Weekly Studies** - Complete content for all 12 weeks
- 🔄 **Offline Support** - PWA with service worker for offline access
- ⚡ **Fast Loading** - Optimized performance with lazy loading
- 🏠 **Add to Home Screen** - Installable PWA

## Directory Structure

```
same-battles/
├── index.html              # Home page with week cards
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js              # JavaScript functionality
├── assets/
│   ├── logo/               # Logo and PWA icons
│   ├── images/             # Week flyer images (week-01.jpg through week-12.jpg)
│   └── audio/              # Audio files (week-01.mp3 through week-12.mp3)
├── weeks/
│   ├── week-01.html        # Individual week pages
│   ├── week-02.html
│   └── ... (through week-12.html)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── README.md               # This file
```

## Asset Requirements

### Logo
- **Location**: `/assets/logo/same-battles-logo.png`
- Recommended size: 400x200px or similar aspect ratio

### PWA Icons
- **Location**: `/assets/logo/icon-192.png` (192x192px)
- **Location**: `/assets/logo/icon-512.png` (512x512px)
- These are required for "Add to Home Screen" functionality

### Week Images
- **Location**: `/assets/images/week-01.jpg` through `week-12.jpg`
- These are the flyer/promotional images for each week
- Recommended: Optimized JPG or WebP format, max 1200px width

### Audio Files
- **Location**: `/assets/audio/week-01.mp3` through `week-12.mp3`
- Audio recordings for each week's teaching
- Recommended: Compressed MP3 format for web delivery

## Setup Instructions

1. **Add Assets**
   - Place your logo in `/assets/logo/same-battles-logo.png`
   - Create and add PWA icons (192x192 and 512x512) to `/assets/logo/`
   - Add week images (week-01.jpg through week-12.jpg) to `/assets/images/`
   - Add audio files (week-01.mp3 through week-12.mp3) to `/assets/audio/`

2. **Test Locally**
   - Serve the files using a local web server (required for service worker)
   - Example: `python -m http.server 8000` or `npx serve`
   - Open `http://localhost:8000` in your browser

3. **Deploy to GitHub Pages**
   - Push the repository to GitHub
   - Go to Settings > Pages
   - Select the branch and folder (usually `main` and `/root`)
   - The site will be available at `https://yourusername.github.io/same-battles/`

## Design System

### Colors
- Primary Dark: `#1a1a1a`
- Secondary Dark: `#2d2d2d`
- Accent (Gold): `#c9a227`
- Text Primary: `#f5f5f5`
- Text Secondary: `#a0a0a0`

### Typography
- Headings: Oswald (Google Fonts)
- Body: Inter (Google Fonts)

## Browser Support

- iOS Safari (primary)
- Chrome Android (primary)
- Modern desktop browsers (secondary)

## Testing Checklist

- [ ] All 12 week pages load correctly
- [ ] Navigation works on mobile
- [ ] Images lazy load
- [ ] Audio player functions
- [ ] Smooth scrolling
- [ ] Works offline (PWA)
- [ ] Add to Home Screen works
- [ ] No horizontal scroll on any device
- [ ] Text readable without zooming
- [ ] All links work

## License

This project is for the "Same Battles" men's Bible study series.
