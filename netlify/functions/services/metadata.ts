import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import { ScrapedMetadata } from '../../../src/types';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage(),
]);


export async function scrapeUrlMetadata(targetUrl: string): Promise<ScrapedMetadata> {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const metadata = await scraper({ html, url: targetUrl });

    return {
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      url: targetUrl
    };
  } catch (error) {
    console.error('Metadata scraping error:', error);
    return {
      url: targetUrl
    };
  }
}
