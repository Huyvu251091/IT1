# Deployment Guide - IELTS Reading Mock Test Website

This guide provides step-by-step instructions for deploying your IELTS Reading website to various hosting platforms.

## 🎯 Deployment Options Overview

| Platform | Difficulty | Cost | Custom Domain | Best For |
|----------|------------|------|---------------|----------|
| **Vercel** | Easy | Free tier | ✅ | React apps, automatic deployments |
| **Netlify** | Easy | Free tier | ✅ | Static sites, drag-and-drop |
| **GitHub Pages** | Medium | Free | ✅ | Open source projects |
| **Firebase Hosting** | Medium | Free tier | ✅ | Google ecosystem integration |
| **AWS S3 + CloudFront** | Hard | Pay-as-you-go | ✅ | Enterprise, high traffic |
| **Traditional Hosting** | Easy | Varies | ✅ | Existing hosting accounts |

## 🚀 Method 1: Vercel (Recommended)

Vercel is perfect for React applications and offers seamless deployment with GitHub integration.

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps

1. **Prepare Your Repository**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: IELTS Reading Test Website"
   
   # Create GitHub repository and push
   git remote add origin https://github.com/yourusername/ielts-reading-test.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed
   - SSL certificate is automatically provided

### Automatic Deployments
Every push to your main branch will automatically trigger a new deployment.

## 🌐 Method 2: Netlify

Netlify offers excellent static site hosting with a user-friendly interface.

### Option A: Drag and Drop

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag the `dist/` folder to the deployment area
   - Your site will be live immediately

### Option B: GitHub Integration

1. **Connect Repository**
   - Sign in to Netlify
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

2. **Custom Domain**
   - Go to Site Settings → Domain Management
   - Add custom domain
   - Configure DNS records
   - SSL is automatically enabled

## 📄 Method 3: GitHub Pages

Free hosting for public repositories with custom domain support.

### Steps

1. **Install GitHub Pages Package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/ielts-reading-test",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure Repository**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Your site will be available at the homepage URL

## 🔥 Method 4: Firebase Hosting

Google's hosting platform with excellent performance and CDN.

### Prerequisites
- Google account
- Firebase CLI: `npm install -g firebase-tools`

### Steps

1. **Initialize Firebase**
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Custom Domain**
   ```bash
   firebase hosting:channel:deploy live --custom-domain yourdomain.com
   ```

## ☁️ Method 5: AWS S3 + CloudFront

Enterprise-grade hosting with global CDN and advanced features.

### Prerequisites
- AWS account
- AWS CLI configured

### Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-ielts-website-bucket
   ```

2. **Configure Static Website Hosting**
   ```bash
   aws s3 website s3://your-ielts-website-bucket \
     --index-document index.html \
     --error-document index.html
   ```

3. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-ielts-website-bucket --delete
   ```

4. **Set Up CloudFront Distribution**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain and SSL certificate

## 🖥️ Method 6: Traditional Web Hosting

For existing hosting accounts (cPanel, shared hosting, VPS).

### Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Compress the `dist/` folder contents
   - Upload to your web hosting public folder (usually `public_html/`)
   - Extract files in the hosting control panel

3. **Configure Web Server**
   
   **Apache (.htaccess)**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

   **Nginx**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## 🐳 Method 7: Docker Deployment

Containerized deployment for consistent environments.

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Deploy
```bash
docker build -t ielts-reading-test .
docker run -p 80:80 ielts-reading-test
```

## 🔧 Environment-Specific Configurations

### Production Optimizations

1. **Vite Configuration** (vite.config.js)
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       assetsDir: 'assets',
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
           }
         }
       }
     }
   })
   ```

2. **Performance Optimizations**
   - Enable gzip compression
   - Set proper cache headers
   - Use CDN for static assets
   - Implement service worker for offline functionality

### Security Headers

Add these headers for enhanced security:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 🔍 Testing Your Deployment

### Pre-Deployment Checklist
- [ ] All features work in production build
- [ ] Answer key upload functions correctly
- [ ] Highlighting and note-taking work properly
- [ ] Grading system calculates scores accurately
- [ ] Responsive design works on mobile devices
- [ ] All images and assets load correctly
- [ ] No console errors in browser

### Post-Deployment Testing
- [ ] Test from different devices and browsers
- [ ] Verify custom domain works (if configured)
- [ ] Check SSL certificate is valid
- [ ] Test performance with tools like PageSpeed Insights
- [ ] Verify all routes work correctly (refresh test)

## 🚨 Troubleshooting Common Issues

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues (404 on refresh)
- Ensure server is configured to serve index.html for all routes
- Check .htaccess or nginx configuration

### Asset Loading Issues
- Verify base URL is correctly set in vite.config.js
- Check that all asset paths are relative

### Performance Issues
- Enable compression on your server
- Optimize images and assets
- Use CDN for static content

## 📊 Monitoring and Analytics

### Adding Google Analytics
1. Create Google Analytics account
2. Add tracking code to index.html
3. Monitor user engagement and performance

### Performance Monitoring
- Use tools like Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring

---

**Need Help?** Check the main README.md for additional troubleshooting tips and support information.

