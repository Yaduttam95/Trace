# Trace

Trace is a minimalist personal capture tool designed to help you offload thoughts, links, and images instantly without the friction of complex note-taking apps.

I built this because I needed a "quick-toggle" inbox for my mind—somewhere to toss an idea or a resource and triage it later.

## Features

- **Instant Capture**: Drop a thought, paste a link, or toss an image into the inbox.
- **Smart Detection**: Automatically distinguishes between text notes and URLs.
- **Auto-Enrichment**: Scrapes metadata (titles, descriptions, images) from URLs automatically.
- **Image Support**: Direct uploads to Cloudinary for reliable storage.
- **Persistent Storage**: Syncs directly with Google Sheets for an easy-to-read, low-maintenance database.
- **Minimalist Design**: High-contrast, accessibility-focused UI with support for dark mode.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Netlify Functions (Serverless TypeScript).
- **Storage**: Google Sheets (via Google Apps Script API) & Cloudinary.
- **Validation**: Zod for type-safe serverless endpoints.

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Yaduttam95/Trace.git
cd Trace
pnpm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
GOOGLE_SCRIPT_URL=your_google_script_web_app_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Locally
```bash
pnpm netlify:dev
```

## Deployment
This project is pre-configured for **Netlify**. 

1. Connect your GitHub repository to Netlify.
2. Set the environment variables in the Netlify site settings.
3. The build command is `pnpm run build` and the publish directory is `dist`.

---

*Keep your head clear. Capture everything else.*
