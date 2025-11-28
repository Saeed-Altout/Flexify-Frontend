# PWA Icons Setup Instructions

## Required Icons

For the PWA to be installable, you need to create two icon files:

1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

## How to Generate Icons

### Option 1: Using Online Tools
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload your logo/image
3. Download the generated icons
4. Place them in `client/public/` folder

### Option 2: Using Your Logo
1. Use your existing logo (logo-light.svg or logo-dark.svg)
2. Convert to PNG format
3. Resize to 192x192 and 512x512 pixels
4. Save as `icon-192x192.png` and `icon-512x512.png`
5. Place in `client/public/` folder

### Option 3: Using ImageMagick (Command Line)
```bash
# Convert SVG to PNG and resize
magick convert logo-light.svg -resize 192x192 icon-192x192.png
magick convert logo-light.svg -resize 512x512 icon-512x512.png
```

### Option 4: Using Figma/Photoshop
1. Create a square canvas (192x192 or 512x512)
2. Place your logo centered
3. Export as PNG
4. Save to `client/public/` folder

## Icon Requirements

- **Format**: PNG
- **Sizes**: 192x192 and 512x512 pixels
- **Background**: Transparent or solid color
- **Content**: Your logo/brand icon
- **Location**: `client/public/icon-192x192.png` and `client/public/icon-512x512.png`

## After Adding Icons

1. Restart your dev server
2. Clear browser cache
3. Visit your site
4. The install prompt should appear after a few seconds

## Testing PWA Installation

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check "Service Workers" - should show registered
4. Check "Manifest" - should show your manifest with icons
5. Look for install prompt in browser address bar

