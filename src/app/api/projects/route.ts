import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID || '');

interface AirtableAttachment {
  url: string;
  filename?: string;
  type?: string;
  size?: number;
}

export async function GET() {
  try {
    const records = await base('Projects').select({
      view: 'Grid view'
    }).all();

    const projects = records.map(record => {

      const imagesField = record.get('Images');
      let images: string[] = [];
      
      if (imagesField && Array.isArray(imagesField)) {
        images = imagesField.map((attachment: AirtableAttachment) => attachment.url);
      }

      return {
        id: record.id,
        name: record.get('Name') as string,
        oneLiner: record.get('One-Liner') as string,
        description: record.get('Description') as string,
        images: images,
        link: record.get('Link') as string
      };
    });

    const response = NextResponse.json(projects);
    
    // Add caching headers for faster subsequent loads
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 