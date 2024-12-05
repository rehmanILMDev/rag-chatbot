import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const ApproachItem = {
  title: "string",
  content: "string",
};

const ApproachCategory = {
  category: "string",
  items: [ApproachItem],
};

const SynergyApproachTabsProps = {
  data: [ApproachCategory],
};

const ProductFeature = {
  title: "string",
  description: "string",
};

const Product = {
  name: "string",
  description: "string",
  features: [ProductFeature],
  icon: "string",
};

const ProductShowcaseProps = {
  title: "string",
  description: "string",
  products: [Product],
};

const SubService = {
  name: "string",
  description: "string",
};

const Service = {
  name: "string",
  description: "string",
  icon: "unknown", // Any value is allowed
  subServices: [SubService], // Optional
};

const ServiceShowcaseProps = {
  services: [Service],
};

const AccordionData = {
  title: "string",
  content: "string",
};

const CustomAccordionProps = {
  data: [AccordionData],
};

const Card = {
  name: "string",
  message: "string",
  avatarUrl: "string", // Valid URL
};

const Industry = {
  name: "string",
  description: "string",
  icon: "unknown", // Any value is allowed
};

const AnnimateCard = {
  industries: [Industry],
};

const Client = {
  name: "string",
  description: "string",
  logo: "string", // Assuming a URL or file path
  industry: "string",
};

const CardCarousel = {
  title: "string",
  description: "string",
  clients: [Client],
};

const Field = {
  type: "text | email | tel | textarea",
  placeholder: "string",
  name: "string",
};

const Action = {
  type: "button | form",
  label: "string", // Optional
  url: "string", // Valid URL, Optional
  fields: [Field], // Optional
};

const ContactMethod = {
  icon: "Mail | Phone | MessageSquare",
  title: "string",
  description: "string",
  action: Action,
};

const ContactInfoCard = {
  title: "string",
  description: "string",
  methods: [ContactMethod],
};

export async function POST(req: Request) {
  const context = await req.json();
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const componentNameWithschema = [
    {
      componentName: "TabComponent",
      schema: SynergyApproachTabsProps,
    },
    {
      componentName: "TabCardComponent",
      schema: ProductShowcaseProps,
    },
    {
      componentName: "TabCardAccordianComponent",
      schema: ServiceShowcaseProps,
    },
    {
      componentName: "AcordianComponent",
      schema: CustomAccordionProps,
    },
    {
      componentName: "CardComponent",
      schema: Card,
    },
    {
      componentName: "AnimationCardComponent",
      schema: AnnimateCard,
    },
    {
      componentName: "CardCarouselComponent",
      schema: CardCarousel,
    },
    {
      componentName: "ContactCardComponent",
      schema: ContactInfoCard,
    },
  ];

  const SelectedComponentSchema = z.object({
    componentName: z.string(),
    schema: z.any(),
  });

  const sampleData = `At ILM UX Pvt Ltd, we offer a range of services to help you achieve your business goals. Here are some of our key offerings:

UX Consulting: Our UX consulting services craft user-centered designs that engage, convert, and retain customers. We collaborate closely with you to align product design with your business goals, ensuring seamless, intuitive experiences that drive results. Services include:

User Research and Analysis
Product Ideation and Concept Design
Wireframes and Prototyping
Design Thinking Workshops
UX Design Audits
UI / Front-end Engineering: We design and develop scalable, maintainable interfaces with the latest web technologies. Our front-end solutions ensure fast, responsive user experiences that are built to grow alongside your business. Services include:

UI Architecture and Design
UI Component Design and Development
Frontend Development with Modern Web Frameworks (React, Angular, etc.)
End-to-End Custom Software Development: From concept to deployment, we build custom software that addresses your specific challenges. Our end-to-end development process ensures your software is unique, efficient, and ready to scale.

Product Development (Mobile/Web): We turn your vision into reality by developing mobile and web products that are scalable, secure, and designed to boost revenue. Our team aligns product strategy with business growth for impactful solutions. Services include:

Product Ideation and Concept Design
Mobile App Development (iOS, Android)
Web Development with Modern Web Frameworks
DevOps and Continuous Integration
Platform Engineering Services: Our platform engineering services focus on cloud-native, secure, and scalable solutions. We design platforms that adapt to your growing needs while ensuring efficiency and reliability. Services include:

UI Architecture and Design
UI Component Design and Development
Frontend Development with Modern Web Frameworks (React, Angular, etc.)
Responsive and Adaptive Design`;

  const result = streamObject({
    model: groq("llama-3.1-70b-versatile"),
    system: `
    You are an intelligent User Experience Designer tasked with analyzing content and mapping it to the most suitable UI component. 
    Your job is to:
    1. Select the most appropriate \`componentName\` from the following predefined list:
    ${JSON.stringify(
      componentNameWithschema.map((c) => c.componentName),
      null,
      2
    )}
    2. Use the schema associated with the selected \`componentName\` from the list below to create the schema for the content:
    ${JSON.stringify(componentNameWithschema, null, 2)}
    3. Your output must strictly adhere to the following format:
    {
      componentName: "SelectedComponentName",
      schema: GeneratedSchemaObject
    }
    
    Rules:
    - Only use the components and schemas provided in the list.
    - Do not generate or suggest components outside of the given list.
    - Analyze the input content carefully to determine the best match.
    
    Return only a single object with \`componentName\` and \`schema\`.
    `,
    prompt: `
    Analyze the following content and determine the best component from the provided list. Then, use the corresponding schema to generate the schema for the content:
    
    Content:
    ${sampleData}
    `,
    schema: SelectedComponentSchema,
  });

  return (await result).toTextStreamResponse();
}
