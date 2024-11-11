const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002', // You can adjust the model as needed
    input: text,
  });
  return response.data[0].embedding;
}
