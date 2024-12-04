'use server'

import { createResource } from '@/lib/actions/resources';
import pdfParse from 'pdf-parse'

export async function processPDF(formData: FormData) {
  const file = formData.get('pdf') as File
  console.log(file, "gdgndgnd");
  
  if (!file) {
    return { error: 'No file uploaded' }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    console.log(arrayBuffer, "dfbdtb");
    
    const data = await pdfParse(Buffer.from(arrayBuffer))
const created = createResource({ content: data.text});
created;

    return { 
      text: data.text, 
      numberOfPages: data.numpages,
      info: data.info
    }
  } catch (error) {
    console.error('Error processing PDF:', error)
    return { error: 'Failed to process PDF' }
  }
}