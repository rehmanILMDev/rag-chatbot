import {  generateText, streamText } from 'ai'
import { createStreamableUI } from 'ai/rsc'
import * as React from "react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from 'zod'
import { groq } from "@ai-sdk/groq"
import { createOpenAI } from '@ai-sdk/openai'
export const runtime = 'edge'

interface ComponentProps {
  suggestions: {
    component: 'Accordion' | 'Cards';
    structure: {
      title: string;
      subPoints: {
        text: string;
      }[];
    }[];
    styles: {
      font: string;
      colorScheme: string;
      spacing: string;
    };
  }[];
}

function DynamicComponent({ suggestions }: ComponentProps) {
  return (
    <div className="container mx-auto p-4">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="mb-8">
          {suggestion.component === 'Accordion' ? (
            <Accordion type="single" collapsible>
              {suggestion.structure.map((item, itemIndex) => (
                <AccordionItem key={itemIndex} value={`item-${itemIndex}`}>
                  <AccordionTrigger className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold">{item.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4">
                      {item.subPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="py-2">{point.text}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestion.structure.map((item, itemIndex) => (
                <Card key={itemIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4">
                      {item.subPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="py-2">{point.text}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


const exampleProps: ComponentProps = {
  suggestions: [
    {
      component: "Accordion",
      structure: [
        {
          title: "Section 1",
          subPoints: [
            { text: "Point 1.1" },
            { text: "Point 1.2" },
            { text: "Point 1.3" },
          ],
        },
        {
          title: "Section 2",
          subPoints: [
            { text: "Point 2.1" },
            { text: "Point 2.2" },
          ],
        },
      ],
      styles: {
        font: "sans-serif",
        colorScheme: "light",
        spacing: "normal",
      },
    },
    {
      component: "Cards",
      structure: [
        {
          title: "Card 1",
          subPoints: [
            { text: "Feature 1" },
            { text: "Feature 2" },
            { text: "Feature 3" },
          ],
        },
        {
          title: "Card 2",
          subPoints: [
            { text: "Benefit 1" },
            { text: "Benefit 2" },
          ],
        },
      ],
      styles: {
        font: "serif",
        colorScheme: "dark",
        spacing: "compact",
      },
    },
  ],
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const uiStream = createStreamableUI()


  const SubPointSchema = z.object({
    text: z.string(),
  });
  
  const StructureSchema = z.object({
    title: z.string(),
    subPoints: z.array(SubPointSchema),
  });
  
  const StylesSchema = z.object({
    font: z.string(),
    colorScheme: z.string(),
    spacing: z.string(),
  });
  
  const SuggestionSchema = z.object({
    component: z.string(),
    structure: z.array(StructureSchema),
    styles: StylesSchema,
  });
  
  const RootSchema = z.object({
    suggestions: z.array(SuggestionSchema),
  });
  
  // Example usage:
  // RootSchema.parse(yourData);
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const text = streamText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    system: 'You are a friendly assistant',
    prompt: 'render the component',
    tools: {
      getComponent: {
        description: 'Render the component',
        parameters:z.object({
          suggestions: z.array(SuggestionSchema),
        }),        
        execute: async () => {
          uiStream.done(
            <DynamicComponent suggestions={exampleProps.suggestions} />
          )
        }
      }
    }
  });

  
return {
  display: uiStream.value
}


}