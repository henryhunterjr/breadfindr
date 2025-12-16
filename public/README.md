# Public Assets Directory

This directory contains static assets that are served at the root of your application.

## Thumbnail/Logo Images

To add a thumbnail or logo for your app:

1. **Favicon** (shown in browser tabs):
   - Place a file named `favicon.ico` in this directory
   - Recommended size: 32x32 or 16x16 pixels
   - Format: ICO file

2. **App Icon/Logo** (for sharing on social media):
   - Place a file named `logo.png` or `thumbnail.png` in this directory
   - Recommended size: 512x512 pixels or larger
   - Format: PNG with transparent background

3. **Social Media Preview Image**:
   - Single image works for all platforms: 1200x630 pixels
   - Name: `og-image.png`
   - This will be used for Facebook, LinkedIn, Twitter, etc.

## How to Upload Images

### Local Development:
1. Copy your image files to this `public` directory
2. Reference them in `index.html` using absolute paths like `/favicon.ico` or `/logo.png`
3. Restart the dev server if images don't appear immediately

### For Deployment (Vercel):
1. Commit your images to this directory: `git add public/`
2. Commit: `git commit -m "Add app thumbnail and icons"`
3. Push: `git push`
4. Vercel will automatically include these files in your deployment

## Supported Formats:
- Images: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
- Icons: `.ico`
- Other: `.pdf`, `.txt`, etc.

All files in this directory will be served from the root URL of your deployed application.
