import { FormattedPayload } from '../../../src/types';


export async function sendToGoogleSheet(payload: FormattedPayload): Promise<void> {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) {
    throw new Error('Google Script URL is not configured.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data to Google Sheets: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Google Sheets Service error:', error);
    throw new Error('Failed to forward payload to Google Sheets.');
  }
}
