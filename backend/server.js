import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Google Sheets setup
const getGoogleSheetsClient = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Google Sheets client error:', error);
    return null;
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Submit email to waitlist
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const timestamp = new Date().toISOString();
  const results = {
    googleSheets: null,
    formspree: null,
  };

  // 1. Save to Google Sheets (if configured)
  if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL) {
    try {
      const sheets = getGoogleSheetsClient();
      if (sheets) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Sheet1!A:B',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[email, timestamp]],
          },
        });
        results.googleSheets = 'success';
        console.log('✓ Saved to Google Sheets:', email);
      }
    } catch (error) {
      console.error('Google Sheets error:', error.message);
      results.googleSheets = 'error';
    }
  } else {
    results.googleSheets = 'not_configured';
  }

  // 2. Send to Formspree
  if (process.env.FORMSPREE_ENDPOINT) {
    try {
      await axios.post(process.env.FORMSPREE_ENDPOINT, {
        email,
        timestamp,
        _subject: 'New Quickgage Waitlist Signup',
      });
      results.formspree = 'success';
      console.log('✓ Sent to Formspree:', email);
    } catch (error) {
      console.error('Formspree error:', error.message);
      results.formspree = 'error';
    }
  } else {
    results.formspree = 'not_configured';
  }

  // Return success if at least one method worked
  const anySuccess = results.googleSheets === 'success' || results.formspree === 'success';

  if (anySuccess) {
    res.json({
      success: true,
      message: 'Successfully added to waitlist',
      results
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Failed to save email',
      results
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Google Sheets: ${process.env.GOOGLE_SHEET_ID ? 'Configured' : 'Not configured'}`);
  console.log(`📧 Formspree: ${process.env.FORMSPREE_ENDPOINT ? 'Configured' : 'Not configured'}`);
});
