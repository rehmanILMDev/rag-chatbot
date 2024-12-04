'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import { Stock } from '@/components/ui/Stock';
import { mistral } from '@ai-sdk/mistral';
// import { Stock } from '@ai-studio/components/stock';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from 'lucide-react';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});




interface SubPoint {
  text: string
}

interface Structure {
  title: string
  subPoints: SubPoint[]
}

interface Styles {
  font: string
  colorScheme: string
  spacing: string
}

interface Suggestion {
  component: string
  structure: Structure[]
  styles: Styles
}

interface ComponentProps {
  suggestions: Suggestion[]
}

function DynamicComponent({ suggestions }: ComponentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="mb-8">
          {suggestion.component === "Accordion" ? (
            <Accordion type="single" collapsible>
              {suggestion.structure.map((section, index) => (
                <AccordionItem key={index} value={section.title}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4">
                      {section.subPoints.map((subPoint, index) => (
                        <li key={index} className="py-2">
                          {subPoint.text}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : suggestion.component === "Cards" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestion.structure.map((card, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4">
                      {card.subPoints.map((subPoint, index) => (
                        <li key={index} className="py-2">
                          {subPoint.text}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p>Component not supported</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

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



export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

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


  const result = await streamUI({
    model: groq("llama3-70b-8192"),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      getComponent: {
        description: 'show component',
        parameters:z.object({
          text: z
          .string()
          .describe('Render the dynamic Compoent'),
        }), 
        generate: async () => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: 'assistant',
              content: `Rendering the component`,
            },
          ]);

          return <DynamicComponent suggestions={exampleProps.suggestions} />          ;
        },
      },
      showStockInformation: {
        description:
          'Get stock information for symbol for the last numOfMonths months',
        parameters: z.object({
          symbol: z
            .string()
            .describe('The stock symbol to get information for'),
          numOfMonths: z
            .number()
            .describe('The number of months to get historical information for'),
        }),
        generate: async ({ symbol, numOfMonths }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: 'assistant',
              content: `Showing stock information for ${symbol}`,
            },
          ]);

          return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
        },
      },
    },
  });

  
  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});