import { Handler, HandlerEvent } from '@netlify/functions';
import { z } from 'zod';
import crypto from 'crypto';
import { CapturePayload, FormattedPayload, ApiResponse } from '../../src/types';
import { uploadImage } from './services/cloudinary';
import { scrapeUrlMetadata } from './services/metadata';
import { sendToGoogleSheet } from './services/sheet';

const captureSchema = z.object({
  type: z.enum(['text', 'url', 'image']),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  note: z.string().optional(),
});


function formatEntry(
  base: CapturePayload,
  enrichment: Partial<FormattedPayload>
): FormattedPayload {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    originalType: base.type,
    content: base.content,
    tags: base.tags,
    note: base.note,
    ...enrichment,
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' } as ApiResponse),
    };
  }

  try {
    const rawBody = JSON.parse(event.body || '{}');
    const parsedData = captureSchema.parse(rawBody) as CapturePayload;
    
    let enrichment: Partial<FormattedPayload> = {};

    if (parsedData.type === 'image') {
      const imageUrl = await uploadImage(parsedData.content);
      enrichment.imageUrl = imageUrl;
      parsedData.content = 'Uploaded Image';
    } else if (parsedData.type === 'url') {
      const metadata = await scrapeUrlMetadata(parsedData.content);
      enrichment.metadata = metadata;
      if (metadata.image) {
        enrichment.imageUrl = metadata.image;
      }
    }

    const entry = formatEntry(parsedData, enrichment);
    await sendToGoogleSheet(entry);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: entry,
      } as ApiResponse<FormattedPayload>),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Invalid payload format', details: error.errors } as ApiResponse),
      };
    }

    console.error('Capture endpoint error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' } as ApiResponse),
    };
  }
};
