import { NextResponse } from 'next/server';
import Airtable from 'airtable';

interface AirtableAttachment {
  url: string;
  filename?: string;
  type?: string;
  size?: number;
}

export async function GET() {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error('Missing Airtable environment variables');
    return NextResponse.json(
      { error: 'Airtable configuration not found' }, 
      { status: 500 }
    );
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const records = await base('Adventures').select({
      view: 'Grid view'
    }).all();

    const adventures = records.map(record => {
      const imagesField = record.get('Images');
      let imageUrls: string[] = [];
      
      if (imagesField && Array.isArray(imagesField) && imagesField.length > 0) {
        imageUrls = imagesField.map((img: AirtableAttachment) => img.url);
      }

      const rawDate = record.get('Date');
      let formattedDate = '';
      if (rawDate) {
        if (typeof rawDate === 'string') {
          formattedDate = rawDate;
        } else if (rawDate instanceof Date) {
          formattedDate = rawDate.toLocaleDateString();
        } else {
          formattedDate = String(rawDate);
        }
      }

      return {
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        date: formattedDate,
        images: imageUrls
      };
    });

    const reversedAdventures = adventures.reverse();

    const response = NextResponse.json(reversedAdventures);
    
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching adventures:', error);
    return NextResponse.json({ error: 'Failed to fetch adventures' }, { status: 500 });
  }
}
