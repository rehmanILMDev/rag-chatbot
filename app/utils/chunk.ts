export function chunkText(text: string, chunkSize = 1000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }
  

export  function preprocessText(text: string) {
    return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  