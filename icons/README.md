# PWA Icons - Required for Installation

## Status: ⚠️ MISSING - Must Create Before Launch

The PWA requires 8 icon sizes for installation on Android and iOS devices. **The service worker will fail to install until these files exist.**

## Required Icon Files:

- `icon-72.png` (72x72px)
- `icon-96.png` (96x96px)
- `icon-128.png` (128x128px)
- `icon-144.png` (144x144px)
- `icon-152.png` (152x152px) - **iOS home screen**
- `icon-192.png` (192x192px) - **Android minimum**
- `icon-384.png` (384x384px)
- `icon-512.png` (512x512px) - **Android maximum**

## Quick Icon Generation (Recommended):

### Option 1: Use Noto Emoji Atom Symbol (Free, No Attribution)

1. Download atom emoji: https://github.com/googlefonts/noto-emoji/raw/main/png/512/emoji_u269b.png
2. Save as `source-icon.png` in this directory
3. Run batch resize:

```bash
cd icons/
convert source-icon.png -resize 72x72 icon-72.png
convert source-icon.png -resize 96x96 icon-96.png
convert source-icon.png -resize 128x128 icon-128.png
convert source-icon.png -resize 144x144 icon-144.png
convert source-icon.png -resize 152x152 icon-152.png
convert source-icon.png -resize 192x192 icon-192.png
convert source-icon.png -resize 384x384 icon-384.png
cp source-icon.png icon-512.png
```

**Requires:** ImageMagick (`brew install imagemagick` or `sudo apt-get install imagemagick`)

### Option 2: Online Tool (No CLI Required)

1. Create or download 512x512px icon
2. Upload to: https://realfavicongenerator.net/
3. Download generated icon pack
4. Extract all `icon-*.png` files to this directory

### Option 3: Temporary Placeholder (For Testing)

For quick testing, use a simple colored square:

```bash
cd icons/
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:'#667eea' icon-$size.png
done
```

This creates purple squares matching the theme color. Replace with proper icons before production.

## Design Guidelines:

- **Theme**: Physics/science (atom symbol recommended)
- **Colors**: Match app gradient (#667eea purple/blue)
- **Style**: Simple, recognizable at small sizes
- **Safe area**: Keep important content in center 80% (Android crops to circles/squircles)

## Verification:

After creating icons, verify service worker installation:

1. Open app in Chrome
2. DevTools → Application → Service Workers
3. Should show "activated" status (not "error")
4. DevTools → Application → Manifest
5. Should show all 8 icons with no warnings

## References:

- Context Handover V3 Addendum: Detailed icon recommendations
- https://web.dev/add-manifest/ - PWA icon best practices
- https://maskable.app/ - Test maskable icon safe areas
