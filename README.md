# AI Creative Studio

Music Studio + Video Studio. Phase 1 (foundation): website, navigation, tool pages, upload checks, health-check server.

## Run locally

Server (terminal 1):

    cd server
    npm install
    cp ../.env.example .env
    npm run dev

Open http://localhost:4000/api/health

Website (terminal 2):

    cd web
    npm install
    cp .env.example .env
    npm run dev

Open http://localhost:5173

## Deploy on Render

1. Push this repo to GitHub.
2. Render dashboard > New > Blueprint > pick this repo. It reads render.yaml and creates two services.
3. After the first deploy, set these environment variables:
   - acs-server: CORS_ORIGIN = the URL of acs-web (no trailing slash)
   - acs-web: VITE_API_URL = the URL of acs-server (no trailing slash)
4. Redeploy acs-web (VITE_API_URL is baked in at build time).

Free-tier services sleep after inactivity, so the first request can be slow.

## Status

Every tool is marked "Coming soon" until it really works. No fake data, no mock results.
