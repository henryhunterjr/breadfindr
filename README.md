# BreadFindr

Find local artisan bread near you. Connect with bakeries, farmers markets, and home bakers in your area.

## Features

- Search for bread sources by location
- Filter by type: Bakeries, Farmers Markets, Home Bakers
- View ratings and specialties
- Get directions and contact info

## Getting Started
```bash
npm install
npm run dev
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Adding App Thumbnail/Logo

To add a thumbnail or logo for your app:

1. **Create your images** with these recommended specifications:
   - **Favicon**: 32x32 or 16x16 pixels (`.ico` format)
   - **App Logo**: 512x512 pixels (`.png` format)
   - **Social Media Preview**: 1200x630 pixels for Open Graph (`.png` format)

2. **Add images to the `public/` directory**:
   ```bash
   # Copy your images to the public directory
   cp /path/to/your/favicon.ico public/
   cp /path/to/your/logo.png public/
   cp /path/to/your/og-image.png public/
   ```

3. **Commit and push**:
   ```bash
   git add public/
   git commit -m "Add app thumbnail and icons"
   git push
   ```

The images will automatically be served at the root of your application (e.g., `https://yourdomain.com/logo.png`).

See `public/README.md` for more detailed instructions and image specifications.

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy

Your images in the `public/` directory will be automatically included in the deployment.

## License

MIT
