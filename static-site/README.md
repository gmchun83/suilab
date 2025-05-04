# PumpSui Static Site

This is a static landing page for the PumpSui meme coin platform, a platform for creating, launching, and trading meme coins on the Sui blockchain.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Contact form with Netlify form handling
- Interactive elements with JavaScript
- Optimized for performance and SEO
- Secure headers configuration

## Deployment with Netlify

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Netlify](https://www.netlify.com/) account

### Setup and Deployment

1. **Install Netlify CLI**
   ```bash
   # Install globally
   npm install -g netlify-cli
   # Or use npx without installing
   npx netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```
   This will open a browser window for you to authorize the Netlify CLI.

3. **Initialize your site** (if not already done)
   ```bash
   netlify init
   ```
   Follow the prompts to:
   - Create a new site or use an existing one
   - Set up your build settings (for this static site, you can skip build commands)

4. **Deploy to Netlify**

   For a draft deployment (preview URL):
   ```bash
   netlify deploy
   ```

   For production deployment:
   ```bash
   netlify deploy --prod
   ```

5. **Continuous Deployment**

   For automatic deployments, connect your GitHub repository to Netlify:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings (leave blank for static site)
   - Deploy!

## Local Development

To preview the site locally:

```bash
netlify dev
```

This will start a local development server, typically at http://localhost:8888.

## Configuration

The `netlify.toml` file contains the configuration for deployment:

```toml
[build]
  publish = "."
  command = ""

[dev]
  publish = "."
  port = 8888

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Enable Netlify forms
[build.processing.html]
  pretty_urls = true

# Handle form submissions
[functions]
  directory = "functions"

# Headers to improve security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:; connect-src 'self'"
```

- `publish = "."` - Deploys the current directory
- The redirect rule ensures proper handling of direct URL access
- Form handling is enabled for the contact form
- Security headers are configured to protect against common web vulnerabilities
- Serverless functions are set up to handle form submissions

## Project Structure

```bash
static-site/
├── css/
│   └── styles.css       # Main stylesheet
├── js/
│   └── main.js          # JavaScript functionality
├── functions/
│   └── submission-created.js  # Netlify function for form handling
├── index.html           # Main HTML file
├── netlify.toml         # Netlify configuration
├── package.json         # Project dependencies and scripts
└── README.md            # This documentation
```
