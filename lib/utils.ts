import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");





export async function processUserQuery(
  messages: any[],
  systemMessage: string,
): Promise<string> {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array is empty or undefined.");
  }

  const lastMessage = messages[messages.length - 1];
  const customModel = groq("llama3-groq-70b-8192-tool-use-preview");



  // Fetch context for the last message
  const context = await getContext(lastMessage.content);

  // Generate text response
  const text = await generateText({
    system: `You are an advanced assistant for ILM UX Pvt Ltd. Your role is to:

    Provide short, professional, and structured responses strictly based on the provided Context and Question.
    Use numbered points for main topics, bullet points for sub-points, and short paragraphs for clarity.
    
    Key Instructions:
     Mandatory Context:
      Only respond if a Context is provided.
      Out-of-Scope Queries:
      First, quote the user's question.
      Then respond with:
      "I'm sorry, but {user's question} is not within the scope of assistance. I can only assist with queries related to ILM UX Pvt Ltd."

    - For greetings, respond with:
      Firstly greet the user, then say, "Welcome to ILM UX Pvt Ltd! We specialize in advanced UX solutions, ensuring our clients' success through innovative designs and user-centric strategies. How can I assist you today?".
    
    - For ILM-related queries, give direct, structured responses.
    - Provide short, professional, and structured responses to user queries strictly based on the provided Context, Application Context and Question.
    - Ensure responses are clear, well-organized, and presented in a visually appealing format, using bullet points, numbered lists, or short paragraphs as appropriate.
    
    Inputs:
    Context: given in the prompt.
    Question: given in the prompt.
    
    Purpose: Ensure responses are relevant, clear, and well-formatted. Do not provide answers without context.`,
    model: customModel,
    prompt: `Answer the following question based only on the provided context:
     context: ${context}
     Question: ${lastMessage.content}`,
    maxTokens: 800,
    temperature: 0.2,
  });

  // Return the generated text
  return text.text;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // const lastMessage = messages[messages.length - 1];
  // const customModel = groq("llama3-groq-70b-8192-tool-use-preview");

  // fetching knowledge base from db
  // // const chunks = await db.select().from(chunk);

  // const coreMessages = convertToCoreMessages(messages).filter(
  //   (message) => message.content.length > 0,
  // );
  // const context = await getContext(lastMessage.content);


  // // Filter and convert messages
  // const coreMessages = convertToCoreMessages(messages).filter(
  //   (message) => message.content.length > 0
  // );


  // const text = await generateText({
  //   system: systemMessage,
  //   model: customModel,
  //   prompt: ` Inputs:
  //       Context: ${context} (This is the provided information about ILM UX Pvt Ltd or related details.)
  //       Question: ${lastMessage.content} (This is the user’s query that needs a response.)`,
  //   // messages: convertToCoreMessages(messages),
  //   maxTokens: 800,
  //   temperature: 0.2,
  // });
  // console.log(text.text, "textuvbfbb");
  console.log("grggf");

  const processedQueryText = await processUserQuery(messages, systemMessage);
  console.log(processedQueryText, "gfnndngfbfbd");

  const result = await streamText({
    model: groq("llama-3.1-70b-versatile"),
    system: `You are an intelligent User Experience Designer tasked with analyzing content and mapping it to the most suitable UI component.
        Your job is to:
        1. Select the most appropriate tool from the tools:

        2. Use the schema associated with the selected tool from the tools below to create the schema for the content from the tool tools.
        Analyze the following content and determine the best component from the provided tools. Then, use the corresponding schema to generate the schema for the content:
           Content:
          ${processedQueryText}
        Rules:
        - Only use the components and schemas provided in the tools.
        - Do not generate or suggest components outside of the given tools.
        - Analyze the input content carefully to determine the best match. `,
    messages: convertToCoreMessages(messages),
    tools: {
      GreetComponent: {
        description: "Get the greet component and an emoji when content related to greetings",
        parameters: GreetsPropsSchema,
        execute: async (item) => {
          return item;
        },
      },
      OutOfScopeComponent: {
        description: `Get the Out of Scope component when content is like "I'm sorry, but {user's question} is not within the scope of assistance. I can only assist with queries related to ILM UX Pvt Ltd." extact the user's question only and use as parameter`,
        parameters: OutOfScopeComponentPropsSchema,
        execute: async (item) => {
          return item;
        },
      },
      TabComponent: {
        description: "Get the tab component",
        parameters: TabsPropsSchema,
        execute: async (item) => {
          return item;
        },
      },
      AcordianComponent: {
        description: "Get the Accordian component",
        parameters: CustomAccordionPropsSchema,
        execute: async (item) => {
          return item;
        },
      },
      TabCardComponent: {
        description: "Get the Tab and Card component",
        parameters: TabCardPropsSchema,
        execute: async (item) => {
          return item;
        },
      },
      TabCardAccordianComponent: {
        description: "Get the Tab, Card and Accordian component",
        parameters: TabCardAccordianPropsSchema,
        execute: async (item) => {
          return item;
        },
      },

      CardComponent: {
        description: "Get the Card component",
        parameters: CardSchema,
        execute: async (item) => {
          return item;
        },
      },
      AnimationCardComponent: {
        description: "Get the Animated Card component",
        parameters: AnnimateCardSchema,
        execute: async (item) => {
          return item;
        },
      },

      CardCarouselComponent: {
        description: "Get the Card Carousel component",
        parameters: CardCarouselSchema,
        execute: async (item) => {
          return item;
        },
      },
      ContactCardComponent: {
        description: "Get the Contact Card component",
        parameters: ContactInfoCardSchema,
        execute: async (item) => {
          return item;
        },
      },
    },
  });
  return result.toDataStreamResponse({});






  const systemMessage = 
  `You are an advanced assistant for ILM UX Pvt Ltd. Your role is to:
     -Provide short, professional, and structured responses to user queries strictly based on the provided Context, Application Context and Question.
     -Ensure responses are clear, well-organized, and presented in a visually appealing format, using bullet points, numbered lists, or short paragraphs as appropriate.

        Key Instructions:

        1.Response Formatting:
        Always base your response on the given Context and Question.
        Use **numbered points for main topics** and **bullet points for sub-points**. Ensure sub-points are clearly distinguished as bullets. 
        Use short paragraphs for concise explanations.

        2.Handling Greetings:
        For greetings without a specific question, respond with:
        Fistly greet user then, "Welcome to ILM UX Pvt Ltd! We specialize in advanced UX solutions, ensuring our clients' success through innovative designs and user-centric strategies. How can I assist you today?"
        
        3.Answering Specific Queries:
        For questions related to ILM UX Pvt Ltd, provide:
        A brief and direct explanation.
        Use formatting (bullet points or sub-points) to improve readability if the response contains multiple aspects.

        4.Out-of-Scope Queries:
        For queries outside the Context, respond politely:
        "I’m sorry, I can only assist with queries related to ILM UX Pvt Ltd."

        Inputs:
        given in the prompt

        Purpose:
        This system ensures that the assistant:
         - Delivers contextually relevant and user-centric responses.
         - Formats responses professionally using **numbered main points and bulleted sub-points** for clear and structured communication.`
