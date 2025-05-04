# Deploying to Netlify

This guide provides step-by-step instructions for deploying your PumpSui static site to Netlify.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)
- A [Netlify](https://www.netlify.com/) account (free tier is available)

## Deployment Steps

### 1. Install Netlify CLI

You can install the Netlify CLI globally:

```bash
npm install -g netlify-cli
```

Or use it without installing via npx:

```bash
npx netlify-cli
```

### 2. Login to Netlify

Authenticate with your Netlify account:

```bash
netlify login
```

This will open a browser window where you can authorize the Netlify CLI.

### 3. Initialize Your Site (Optional)

If you want to connect your site to an existing Netlify site or create a new one:

```bash
netlify init
```

Follow the prompts to:
- Create a new site or use an existing one
- Set up your build settings (for this static site, you can skip build commands)

### 4. Deploy Your Site

#### For a Draft Deployment (Preview URL)

```bash
netlify deploy
```

This will deploy your site to a unique preview URL that you can share for testing.

#### For Production Deployment

```bash
netlify deploy --prod
```

This will deploy your site to your production URL (either a Netlify subdomain or your custom domain if configured).

## Using the Provided Scripts

We've added some npm scripts to make deployment easier:

```bash
# Start a local development server
npm run dev

# Create a draft deployment
npm run deploy

# Create a production deployment
npm run deploy:prod
```

## Configuration

The `netlify.toml` file contains the basic configuration for deployment:

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
```

- `publish = "."` - Deploys the current directory
- The redirect rule ensures proper handling of direct URL access for single-page applications

## Continuous Deployment

For automatic deployments whenever you push to your repository:

1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose your repository
4. Configure build settings:
   - Build command: (leave blank for static site)
   - Publish directory: `.` (the root directory)
5. Click "Deploy site"

## Custom Domain

To use your own domain name:

1. Go to your site's dashboard on Netlify
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS settings

## Troubleshooting

- **Authentication Issues**: If you encounter problems with `netlify login`, try using `netlify login --new` to force a new authentication session.
- **Deployment Failures**: Check that your `netlify.toml` file is correctly configured.
- **Path Issues**: Make sure all paths in your HTML are relative or absolute from the root.

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify CLI Documentation](https://cli.netlify.com/)
- [Netlify Community Forum](https://community.netlify.com/)
