'use server'

import { generateObject, generateText } from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { z } from 'zod';

export async function generateTypeScript(prompt: string) {
    const componentTemplate = `

import { // Define the Icons that will be use } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

     interface ComponentProps {
      // Define props with appropriate types.
    }

     function ComponentName({ // Define props }: ComponentProps) {
      return (
        <div>
          {/* Implement component logic here */}
        </div>
      );
    };
  
    `;
    
    const GENERATE_COMPONENT_PROMPT = `
    You are an expert Frontend Developer skilled in React with TypeScript.
    
    Your task is to generate a React Functional Component based on the provided description. The component should:
    1. Be written in TypeScript with proper typings for props and states.
    2. Use only @react-agent/shadcn-ui for UI components and recharts for charts when applicable.
    3. Be styled using Tailwind CSS.
    4. Follow React best practices and be production-ready.
    5. Cover all necessary use cases and states.
    
    ---
    Return Example:
    ${componentTemplate}
    ---
    
    Instructions:
    1. Assume the project has a React TypeScript setup and uses Tailwind CSS.
    2. The component should be fully functional and include realistic example data and handlers when required.
    3. Avoid external libraries other than @react-agent/shadcn-ui and recharts.
    5. Make the component reusable and readable, ensuring proper separation of concerns.
    6. Used shadcn/ui components like Avatar, Badge, Button, card and others.
    7. Adjusted the layout to be responsive using Tailwind CSS classes.
    8. Used semantic HTML elements for better accessibility.
    9. Provided fallback for the image, icon in case it fails to load.
    10. Simplified class names while maintaining the same visual style.

 The returned code should be wrapped in markdown using \`\`\`tsx <Your Code Here> \`\`\`.

    `;
    
    const systemMessage = `You are an intelligent User Experience Designer specializing in creating visually appealing and effective UI component suggestions for text-based content. Your role is to:

1. **Analyze the Content**: 
   - Understand the provided content, its structure, and its intended purpose.
   - Identify the most appropriate way to visually represent the content to enhance user engagement, readability, and overall user experience.

2. **Suggest UI Components**:
   - Recommend specific UI components, such as:
     - Cards for grouping related content with clear headers and bullet-pointed details.
     - Collapsible panels for expandable sections of information.
     - Tabs for categorization of content into distinct, navigable sections.
     - Accordions for hierarchically dense information.
     - Tooltips or popovers for supplementary explanations.
     - Timelines or progress bars for step-by-step or sequential information.
   - Ensure that the suggested components align with modern UX principles and design aesthetics.

3. **Structure the Suggestions**:
   - For each suggestion, provide:
     - The type of UI component (e.g., card, collapsible panel).
     - A short description of why the component is appropriate.
     - A detailed breakdown of how the content should be displayed, including:
       - Titles for sections or categories.
       - Sub-points as bullet points (if applicable).
       - Highlighting options for key information (e.g., bold text, color emphasis).
     - Optional style recommendations for fonts, colors, and spacing to enhance the design.

4. **Present the Output in a Clear Format**:
   - Provide structured responses in a JSON-like format suitable for programmatic use.
   - Follow this format:
     
     {
       "content": "The raw content provided.",
       "suggestions": [
         {
           "component": "Component name (e.g., card, collapsiblePanel)",
           "description": "Short explanation of why this component is ideal.",
           "structure": [
             {
               "title": "Section or category title",
               "subPoints": [
                 { "text": "Detail text", "emphasis": true/false }
               ]
             }
           ],
           "styles": {
             "font": "Suggested font style (e.g., modern, serif)",
             "colorScheme": "Suggested color scheme (e.g., light, dark)",
             "spacing": "Suggested spacing (e.g., tight, normal, wide)"
           }
         }
       ]
     }
     

5. **Error Handling**:
   - If you cannot determine the appropriate UI component, provide a fallback suggestion, such as a simple list or paragraph format.

Your purpose is to ensure that each response delivers thoughtful and creative UI component suggestions that meet user requirements while adhering to modern design standards.
`
    const assistantResponse = `"1. **Essential Cookies**
   - Necessary for the website to function properly.
   - Enable secure logins and remember shopping cart items.

2. **Analytics Cookies**
   - Used to track and analyze visitor behavior.
   - Help improve the overall user experience by understanding which pages are most popular and how users interact with our website."`



   const newsysMsg = `
   You are an expert Frontend Developer skilled in React with TypeScript, specializing in building dynamic and responsive UI components for structured content.

Your task is to generate a reusable and production-ready React Functional Component and also it should be responsive that dynamically renders UI elements based on the given JSON structure. The component should:

1. **Use Case**: 
   - Render UI components (e.g., Accordions, Cards) described in the input JSON.
   - Adapt styles and layout using Tailwind CSS for responsiveness and visual appeal.
   - Ensure accessibility and semantic HTML usage.

2. **Implementation Details**:
   - Write the component in **TypeScript** with proper typings for props and states.
   - Use **Tailwind CSS** for styling and responsive design.
   - Follow React best practices, including separation of concerns and state management if required.
   - Provide fallback mechanisms for dynamic elements like images or icons.

3. **Component Features**:
   - Dynamically render the structure provided in the suggestions array from the input JSON.
   - Ensure the component is **flexible**, **Responsive** and **reusable**, handling various types of structure in the JSON.
   - Apply styles as suggested in the JSON styles key, including fonts, colors, and spacing.
   - Include realistic example data where needed.

4. **Output Example**:
   The returned code should:
   - Include the rendered component logic.
   - Be wrapped in markdown using \`\`\`tsx <Your Code Here> \`\`\`.
   - Follow this template:
    ${componentTemplate}
    

5. **Styling Guidelines**:
   - Use **Tailwind CSS classes** for styling.
   - Ensure the layout is responsive and visually balanced.
   - Follow the style recommendations provided in the JSON (e.g., color schemes, font types, spacing).

6. **Error Handling**:
   - Provide fallback UI for missing or incomplete data in the JSON.
   - Use placeholder icons or text where applicable.

Your goal is to dynamically interpret the given JSON structure and produce a React Functional Component that visually represents the data using modern UI principles.`


const pmpt = `{
  "content": "1. **Essential Cookies**\n- Necessary for the website to function properly.\n- Enable secure logins and remember shopping cart items.\n\n2. **Analytics Cookies**\n- Used to track and analyze visitor behavior.\n- Help improve the overall user experience by understanding which pages are most popular and how users interact with our website.",
  "suggestions": [
    {
      "component": "Accordion",
      "description": "An accordion component is suitable for this content as it allows users to expand and collapse sections of information, making it easier to scan and understand the different types of cookies used.",
      "structure": [
        {
          "title": "Essential Cookies",
          "subPoints": [
            { "text": "Necessary for the website to function properly." },
            { "text": "Enable secure logins and remember shopping cart items." }
          ]
        },
        {
          "title": "Analytics Cookies",
          "subPoints": [
            { "text": "Used to track and analyze visitor behavior." },
            { "text": "Help improve the overall user experience by understanding which pages are most popular and how users interact with our website." }
          ]
        }
      ],
      "styles": {
        "font": "Modern sans-serif font (e.g., Open Sans, Lato)",
        "colorScheme": "Neutral with a touch of color for emphasis (e.g., #333, #666, #999)",
        "spacing": "Normal spacing for readability (e.g., 16px font size, 24px line height)"
      }
    },
    {
      "component": "Cards",
      "description": "A card component can also be used to display the information in a more visual and organized way, with clear headers and bullet points.",
      "structure": [
        {
          "title": "Essential Cookies",
          "subPoints": [
            { "text": "Necessary for the website to function properly." },
            { "text": "Enable secure logins and remember shopping cart items." }
          ]
        },
        {
          "title": "Analytics Cookies",
          "subPoints": [
            { "text": "Used to track and analyze visitor behavior." },
            { "text": "Help improve the overall user experience by understanding which pages are most popular and how users interact with our website." }
          ]
        }
      ],
      "styles": {
        "font": "Modern sans-serif font (e.g., Open Sans, Lato)",
        "colorScheme": "Neutral with a touch of color for emphasis (e.g., #333, #666, #999)",
        "spacing": "Normal spacing for readability (e.g., 16px font size, 24px line height)"
      }
    }
  ]
}`

const propTemplate =  `const exampleProps: ComponentProps = {
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
}`

const schema = z.object({
  content: z.string(),
  suggestions: z.array(
    z.object({
      component: z.enum(["card", "accordion", "tabs", "collapsiblePanel", "timeline", "list"]),
      description: z.string(),
      structure: z.union([
        z.array(
          z.object({
            title: z.string(),
            subPoints: z.array(
              z.object({
                text: z.string(),
                emphasis: z.boolean().optional(),
              })
            ),
          })
        ),
        z.object({
          title: z.string(),
          subPoints: z.array(
            z.object({
              text: z.string(),
              emphasis: z.boolean().optional(),
            })
          ),
        }),
      ]),
      styles: z.object({
        font: z.string(),
        colorScheme: z.string(),
        spacing: z.string(),
      }),
    })
  ),
});

    const groq = createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY,
      });
    
      const object  = await generateObject({
        model: groq("llama-3.1-70b-versatile"),
        system: `You are an intelligent User Experience Designer specializing in creating visually appealing and effective UI component suggestions for text-based content. Analyze the given content and suggest appropriate UI components.`,
        prompt: `Analyze the following content and suggest appropriate UI components: ${assistantResponse}`,
        schema: schema
      })
   console.log("Generated UI Suggestions:")
  console.log(object.object)

  const result = await generateText({
    model: groq("llama-3.1-70b-versatile"),
    system: `You are an expert React developer skilled in TypeScript. Your task is to generate a highly interactive, visually appealing, and reusable React Functional Component using Tailwind CSS based on a given JSON structure. The component must:

1. Dynamically render **advanced interactive UI elements** (e.g., Accordions, Tabs, Cards, Modals, or Drag-and-Drop areas) as described in the JSON structure.
2. Incorporate **interactivity** such as animations (e.g., collapsible sections, hover effects) and stateful behaviors (e.g., toggles, expanded views).
3. Ensure the component is **responsive**, **accessible**, and uses **semantic HTML** for better usability and compliance.
4. Use **Tailwind CSS** to achieve a modern and polished design with responsive layouts and proper spacing, fonts, and colors.
5. Be written in **clean, production-ready TypeScript** with detailed typings for props and state.
6. Include **error handling and fallback mechanisms** for incomplete or missing data, such as placeholder content or default icons.
7. Leverage React best practices, such as separation of concerns, efficient state management, and component reusability.
8. Use **example JSON data** to showcase the functionality in a realistic scenario.

### Example Props Structure:
${propTemplate}


### Output Format:

Return only the DynamicComponent, excluding the app's code. Do not include instructions on how to use the DynamicComponent with a prop. The condition is mandatory: only the DynamicComponent is required as given below in componentTemplate. Wrap it in Markdown using the specified format:
${componentTemplate}

### Key Features:
- Interactive and engaging design, supporting animations and dynamic elements.
- Comprehensive use of the JSON structure, handling nested and conditional data structures effectively.
- Example use cases: Dynamic forms, rich content accordions, tabbed navigation, and styled card grids.

Focus solely on generating the dynamic and interactive component logic with an excellent user experience.

`,
    prompt: `${object.object}`,
    temperature: 0.4,
    maxTokens: 1000,
  })

  return result.text;





}




