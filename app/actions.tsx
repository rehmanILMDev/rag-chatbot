'use server'

import { generateText } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { createAI } from 'ai/rsc'
import { ServerMessage } from './actions/reactcompoui'

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  display: string
}
const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });
  
  
export async function continueConversation(input: string): Promise<ClientMessage> {
  try {
    const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        messages: [{ role: 'user', content: input }]
    })

    return {
      id: Date.now().toString(),
      role: 'assistant',
      display: text
    }
  } catch (error) {
    console.error('Error in continueConversation:', error)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      display: 'Sorry, there was an error processing your request.'
    }
  }
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
      continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
  });