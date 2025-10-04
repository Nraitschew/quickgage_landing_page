# Quickgage Landing Page

Premium, minimalist waitlist landing page for Quickgage - AI voice personalization platform.

## Features

- ✨ Animated starfield background with floating orbs
- 🎯 Scroll-triggered animations
- 📧 Email validation and waitlist signup
- 📊 Dual submission: Formspree + Google Sheets
- 🐳 Docker Compose deployment ready

## Quick Start

### Local Development

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start frontend (port 5173)
npm run dev

# Start backend (port 3001)
cd backend
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

Frontend will be available at `http://localhost:80`
Backend API at `http://localhost:3001`

## Configuration

### 1. Formspree (Already Configured)
The Formspree endpoint is already set in `.env`:
```
FORMSPREE_ENDPOINT=https://formspree.io/f/mwprqpky
```

### 2. Google Sheets (Optional)

To enable Google Sheets integration:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and click "Create"
   - Skip optional permissions and click "Done"

4. **Generate Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose JSON format
   - Download the key file

5. **Configure Environment Variables**
   - Open the downloaded JSON file
   - Copy values to `.env`:
   ```bash
   GOOGLE_SHEET_ID=your_spreadsheet_id
   GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

6. **Share Your Google Sheet**
   - Open your Google Sheet
   - Click "Share"
   - Add the `client_email` from your service account
   - Give it "Editor" permissions

7. **Set Up Sheet Structure**
   - Column A: Email
   - Column B: Timestamp

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Required
- `FORMSPREE_ENDPOINT` - Formspree form endpoint (already configured)

### Optional
- `GOOGLE_SHEET_ID` - Your Google Sheet ID
- `GOOGLE_CLIENT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key

## Project Structure

```
quickgage/
├── QuickgageLanding.jsx    # Main React component
├── src/
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind imports
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend container
├── docker-compose.yml      # Multi-container orchestration
├── Dockerfile              # Frontend container
├── nginx.conf              # Nginx configuration
└── .env                    # Environment variables
```

## API Endpoints

### POST /api/waitlist
Submit email to waitlist

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "results": {
    "googleSheets": "success",
    "formspree": "success"
  }
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-10-04T12:00:00.000Z"
}
```

## Deployment Notes

- Frontend is served via Nginx on port 80
- Backend API runs on port 3001
- Both services are containerized and networked
- Environment variables are loaded from `.env` file
- Formspree works immediately, Google Sheets requires setup
- The app will work even if Google Sheets is not configured

## Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, Vite
- **Backend:** Node.js, Express, Google Sheets API, Axios
- **Deployment:** Docker, Docker Compose, Nginx
- **Integrations:** Formspree, Google Sheets

## License

© 2024 Quickgage. All rights reserved.
