import { Handler } from '@netlify/functions';
import { ApiResponse } from '../../src/types';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' } as ApiResponse),
    };
  }

  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Google Script URL is not configured.' } as ApiResponse),
    };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from sheets: ${response.statusText}`);
    }

    const json = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (error) {
    console.error('Inbox fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal Server Error fetching data' } as ApiResponse),
    };
  }
};
