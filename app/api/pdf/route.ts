import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specialized in extracting structured data from PDFs. Provide the extracted information in a clear, organized JSON format.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all relevant information from this PDF. Provide the extracted data in a structured JSON format.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${base64}`
              }
            }
          ]
        }
      ],
      model: 'mixtral-8x7b-32768',
      max_tokens: 4000,
    });

    const extractedText = completion.choices[0]?.message?.content || '';

    // Attempt to parse the extracted text as JSON
    let structuredData;
    try {
      structuredData = JSON.parse(extractedText);
    } catch (error) {
      console.error('Failed to parse extracted text as JSON:', error);
      structuredData = { rawText: extractedText };
    }

    return NextResponse.json({
      message: 'PDF processed successfully',
      extractedData: structuredData
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}