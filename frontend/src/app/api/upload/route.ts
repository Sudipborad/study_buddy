
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

    // Check file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Please upload a file smaller than 25MB.' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'text/plain') {
      text = buffer.toString('utf-8');
    } else if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' }, { status: 400 });
    }

    return NextResponse.json({ text });
    
  } catch (error) {
    console.error('Error processing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during file processing.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
