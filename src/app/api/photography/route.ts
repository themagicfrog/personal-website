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

    const records = await base('Photography').select({
      view: 'Grid view'
    }).all();

    const photos = records.map(record => {
      const imageField = record.get('Image');
      let imageUrl = '';
      
      if (imageField && Array.isArray(imageField) && imageField.length > 0) {
        imageUrl = imageField[0].url; 
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
        title: record.get('Title') as string,
        image: imageUrl,
        collection: record.get('Collection') as string,
        date: formattedDate
      };
    });

    console.log('Processed photos:', photos);

    const response = NextResponse.json(photos);
    
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching photography:', error);
    return NextResponse.json({ error: 'Failed to fetch photography' }, { status: 500 });
  }
}
