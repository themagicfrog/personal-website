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

    const records = await base('Art').select({
      view: 'Grid view'
    }).all();

    const artPieces = records.map(record => {

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
        description: record.get('Description') as string,
        image: imageUrl,
        date: formattedDate
      };
    });

    const response = NextResponse.json(artPieces);
    
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching art:', error);
    return NextResponse.json({ error: 'Failed to fetch art' }, { status: 500 });
  }
} 