import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

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

// Counter for waitlist positions (in-memory, resets on restart)
let waitlistCounter = 1;

// Submit email to waitlist
app.post('/api/waitlist', async (req, res) => {
  const { email, name, company, role, useCase, referralSource, social, timestamp } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const submissionTime = timestamp || new Date().toISOString();
  const position = waitlistCounter++;

  // Calculate priority score (1 = email only, 2 = with details)
  const hasDetails = name || company || role || useCase || referralSource || social;
  const priorityScore = hasDetails ? 2 : 1;

  const results = {
    googleSheets: null,
    formspree: null,
    position,
  };

  // 1. Save to Google Sheets (if configured)
  if (process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL) {
    try {
      const sheets = getGoogleSheetsClient();
      if (sheets) {
        // First check if headers exist
        try {
          const headerCheck = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A1:J1',
          });

          // If no headers, add them
          if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: 'Sheet1!A1:J1',
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [['Email', 'Timestamp', 'Name', 'Company', 'Role', 'Use Case', 'Referral Source', 'Social', 'Priority Score', 'Position']],
              },
            });
          }
        } catch (headerError) {
          // If checking headers fails, just continue
          console.log('Note: Could not check/set headers');
        }

        // Append the data
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Sheet1!A:J',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              email,
              submissionTime,
              name || '',
              company || '',
              role || '',
              useCase || '',
              referralSource || '',
              social || '',
              priorityScore,
              position
            ]],
          },
        });
        results.googleSheets = 'success';
        console.log(`✓ Saved to Google Sheets: ${email} (Position: #${position}, Priority: ${priorityScore})`);
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
        timestamp: submissionTime,
        name: name || 'Not provided',
        company: company || 'Not provided',
        role: role || 'Not provided',
        useCase: useCase || 'Not provided',
        referralSource: referralSource || 'Not provided',
        social: social || 'Not provided',
        priorityScore,
        position,
        _subject: 'New Quickgage Waitlist Signup',
      });
      results.formspree = 'success';
      console.log(`✓ Sent to Formspree: ${email} (Position: #${position})`);
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
      position,
      priorityScore,
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
