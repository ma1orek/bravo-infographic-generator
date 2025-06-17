# 🚀 BRAVO Infographic Generator - Deployment Guide

## Netlify Deployment Instructions

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial BRAVO Infographic Generator"
   git branch -M main
   git remote add origin https://github.com/yourusername/bravo-infographic-generator.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your `bravo-infographic-generator` repository
   - Netlify will automatically detect the `netlify.toml` configuration

3. **Automatic Configuration:**
   The `netlify.toml` file includes:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node.js version: 18
   - SPA redirects for React Router
   - Performance optimizations

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - You'll get a URL like `https://magical-unicorn-123456.netlify.app`

### Option 2: Manual Deployment

1. **Build locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to the deploy area
   - Get instant deployment

### Option 3: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and deploy:**
   ```bash
   netlify login
   npm run build
   netlify deploy --prod --dir=dist
   ```

## Environment Configuration

### Required Environment Variables (if using external APIs)
```
# Add these in Netlify Dashboard > Site Settings > Environment Variables
VITE_TVMAZE_API_KEY=your_key_here
VITE_WIKIPEDIA_API_KEY=your_key_here
```

### Build Settings
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

## Domain Configuration

### Custom Domain (Optional)
1. Go to Netlify Dashboard > Domain settings
2. Add your custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

## Performance Optimizations

The app includes:
- ✅ Automatic asset optimization
- ✅ CDN distribution
- ✅ Gzip compression
- ✅ Cache headers for static assets
- ✅ SPA routing support
- ✅ Progressive Web App features

## Post-Deployment Testing

1. **Test Core Features:**
   - [ ] Actor search functionality
   - [ ] Drag and drop interactions
   - [ ] Layout shuffling (8 layouts)
   - [ ] PDF/PNG export
   - [ ] Color scheme changes
   - [ ] Responsive design

2. **Test Rachel Zegler Data:**
   - [ ] Search for "Rachel Zegler"
   - [ ] Verify Wikipedia images load
   - [ ] Check all fun facts display
   - [ ] Test comprehensive actor data

3. **Performance Testing:**
   - [ ] Page load speed < 3 seconds
   - [ ] Image optimization working
   - [ ] No console errors
   - [ ] Mobile responsiveness

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **API Errors:**
   - Check CORS settings in `netlify.toml`
   - Verify API endpoints are accessible
   - Check console for network errors

3. **Images Not Loading:**
   - Verify Wikipedia API is accessible
   - Check image URLs in console
   - Test with fallback images

4. **Export Not Working:**
   - Ensure html2canvas and jspdf load correctly
   - Check for console errors during export
   - Test in different browsers

## Live Demo

Once deployed, your app will be available at:
`https://your-site-name.netlify.app`

## Features Included

✅ **8 Predefined Layouts** - Elements stay within visible bounds
✅ **Rachel Zegler Integration** - Complete Wikipedia data
✅ **Real Wikipedia Images** - No Unsplash fallbacks  
✅ **TVMaze API Integration** - Live actor data
✅ **PDF/PNG Export** - A4 format support
✅ **Drag & Drop** - Fully interactive elements
✅ **Text Editing** - Click to edit any text
✅ **Color Schemes** - Multiple BRAVO themes
✅ **Responsive Design** - Works on all devices

## Support

For deployment issues:
1. Check Netlify build logs
2. Verify all dependencies in package.json
3. Test locally first with `npm run build && npm run preview`
4. Check browser console for errors

Happy deploying! 🎬✨