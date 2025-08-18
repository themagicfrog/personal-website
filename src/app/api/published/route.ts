import { NextResponse } from 'next/server';
import Airtable from 'airtable';

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

    const records = await base('Published').select({
      view: 'Grid view'
    }).all();

    const published = records.map(record => {
      return {
        id: record.id,
        title: record.get('Title') as string,
        words: record.get('Words') as number,
        date: record.get('Date') as string,
        oneLiner: record.get('One-liner') as string,
        tag: record.get('Tag') as string,
        description: record.get('Description') as string,
        link: record.get('Link') as string
      };
    });

    const response = NextResponse.json(published);
    
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching published works:', error);
    return NextResponse.json({ error: 'Failed to fetch published works' }, { status: 500 });
  }
}
