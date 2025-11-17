
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse';

// Configure the route to handle larger files
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Only handle Word documents server-side now
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && 
        file.type !== 'application/msword') {
      return NextResponse.json({ error: 'This endpoint only processes Word documents.' }, { status: 400 });
    }

    // Smaller size limit for Word docs to avoid 413 errors
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Word document too large. Please upload a file smaller than 10MB.' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    
    return NextResponse.json({ text: result.value });
    
  } catch (error) {
    console.error('Error processing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during file processing.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
