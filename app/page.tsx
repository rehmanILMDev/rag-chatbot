// "use client";

// import ReactCompoUi from "@/components/ui/reactui";

// export default function Chat() {

//   return (
//     // <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//     //   <div className="space-y-4">
//     //     {messages.map((m) => (
//     //       <div key={m.id} className="whitespace-pre-wrap">
//     //         <div>
//     //           <div className="font-bold">
//     //             {m.role === "user" ? "Rehman: " : "AI: "}
//     //           </div>
//     //           <p>
//     //             {m.content.length > 0 ? (
//     //               m.content
//     //             ) : (
//     //               <span className="italic font-light">
//     //                 {"calling tool: " + m?.toolInvocations?.[0].toolName}
//     //               </span>
//     //             )}
//     //           </p>
//     //         </div>
//     //       </div>
//     //     ))}

//     //     {isLoading && (
//     //       <div>
//     //         <div className="flex space-x-2 justify-center items-center dark:invert">
//     //           <span className="sr-only">Loading...</span>
//     //           <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//     //           <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//     //           <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
//     //         </div>
//     //         <button
//     //           type="button"
//     //           className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
//     //           onClick={() => stop()}
//     //         >
//     //           stop
//     //         </button>
//     //       </div>
//     //     )}

//     //     {error && (
//     //       <>
//     //         <div>An error occurred.</div>
//     //         <button type="button" onClick={() => reload()}>
//     //           Retry
//     //         </button>
//     //       </>
//     //     )}
//     //   </div>

//     //   <form onSubmit={handleSubmit}>
//     //     <input
//     //       className="fixed bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
//     //       value={input}
//     //       placeholder="Say something..."
//     //       onChange={handleInputChange}
//     //       disabled={isLoading}
//     //     />
//     //   </form>
//     // </div>
// <ReactCompoUi/>
//   );
// }

// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export default function PDFProcessor() {
//   const [file, setFile] = useState<File | null>(null)
//   const [processing, setProcessing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [result, setResult] = useState<{
//     chunkCount: number
//     embeddingCount: number
//     chunks: string[]
//   } | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//       setProgress(0)
//       setResult(null)
//       setError(null)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!file) return

//     setProcessing(true)
//     setProgress(0)
//     setError(null)
//     setResult(null)

//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       setProgress(20) // Started processing
//       const response = await fetch('/api/pdf', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error('Failed to process PDF')
//       }

//       setProgress(60) // Processing complete
//       const data = await response.json()
//       setProgress(100) // Results received
//       setResult(data)
//     } catch (err) {
//       setError('Error processing PDF. Please try again.')
//     } finally {
//       setProcessing(false)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid w-full max-w-sm items-center gap-1.5">
//               <Input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//                 className="cursor-pointer"
//               />
//             </div>
//             <Button type="submit" disabled={!file || processing}>
//               {processing ? 'Processing...' : 'Process PDF'}
//             </Button>

//           </form>

//           {error && (
//             <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
//               {error}
//             </div>
//           )}

//           {result && (
//             <div className="mt-4 space-y-4">
//               <div className="grid gap-2">
//                 <h3 className="font-semibold">Processing Results:</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-muted rounded-lg">
//                     <p className="text-sm font-medium">Chunks Created</p>
//                     <p className="text-2xl font-bold">{result.chunkCount}</p>
//                   </div>
//                   <div className="p-4 bg-muted rounded-lg">
//                     <p className="text-sm font-medium">Embeddings Generated</p>
//                     <p className="text-2xl font-bold">{result.embeddingCount}</p>
//                   </div>
//                 </div>
//               </div>

//               {result.chunks && result.chunks.length > 0 && (
//                 <div className="space-y-2">
//                   <h3 className="font-semibold">Preview of first chunk:</h3>
//                   <div className="p-4 bg-muted rounded-lg">
//                     <p className="text-sm whitespace-pre-wrap">
//                       {result.chunks[0].substring(0, 200)}...
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//     </div>
//   )
// }

// 'use client'

// import { useState } from 'react'
// import { useFormStatus } from 'react-dom'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { processPDF } from './actions/pdfData'

// function SubmitButton() {
//   const { pending } = useFormStatus()
//   return (
//     <Button type="submit" disabled={pending}>
//       {pending ? 'Processing...' : 'Upload and Process'}
//     </Button>
//   )
// }

// export default function PDFUploader() {
//   const [result, setResult] = useState<{ text?: string; numberOfPages?: number; error?: string } | null>(null)

//   async function handleSubmit(formData: FormData) {
//     console.log("Formdata", formData)
//     const response = await processPDF(formData)
//     setResult(response)
//   }

//   return (
//     <>
//         <form action={handleSubmit} className="space-y-4">
//           <Input
//             type="file"
//             name="pdf"
//             accept=".pdf"
//             required
//             className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
//           />
//           <SubmitButton />
//         </form>

//         {result && (
//           <div className="mt-8">
//             {result.error ? (
//               <p className="text-red-500">{result.error}</p>
//             ) : (
//               <>
//                 <h3 className="text-lg font-semibold mb-2">Processed PDF Content</h3>
//                 <p className="mb-2">Number of pages: {result.numberOfPages}</p>
//                 <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
//                   <pre className="whitespace-pre-wrap">{result.text}</pre>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//      </>
//   )
// }

// 'use client';

// import { useCompletion } from 'ai/react';

// export default function Chat() {
//   const { completion, input, handleInputChange, handleSubmit } =
//     useCompletion();

//   return (
//     <div>
//       {completion}
//       <form onSubmit={handleSubmit}>
//         <input value={input} onChange={handleInputChange} />
//       </form>
//     </div>
//   );
// }

// // tool invocation
// 'use client';

// import { ToolInvocation } from 'ai';
// import { Message, useChat } from 'ai/react';

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit, addToolResult } =
//     useChat({
//       maxToolRoundtrips: 5,
//       // run client-side tools that are automatically executed:
//       async onToolCall({ toolCall }) {
//         if (toolCall.toolName === 'getLocation') {
//           const cities = [
//             'New York',
//             'Los Angeles',
//             'Chicago',
//             'San Francisco',
//           ];
//           return cities[Math.floor(Math.random() * cities.length)];
//         }
//       },
//     });

//   return (
//     <>
//       {messages?.map((m: Message) => (
//         <div key={m.id}>
//           <strong>{m.role}:</strong>
//           {m.content}
//           {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
//             const toolCallId = toolInvocation.toolCallId;
//             const addResult = (result: string) =>
//               addToolResult({ toolCallId, result });

//             // render confirmation tool (client-side tool with user interaction)
//             if (toolInvocation.toolName === 'askForConfirmation') {
//               return (
//                 <div key={toolCallId}>
//                   {toolInvocation.args.message}
//                   <div>
//                     {'result' in toolInvocation ? (
//                       <b>{toolInvocation.result}</b>
//                     ) : (
//                       <>
//                         <button onClick={() => addResult('Yes')}>Yes</button>
//                         <button onClick={() => addResult('No')}>No</button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               );
//             }

//             // other tools:
//             return 'result' in toolInvocation ? (
//               <div key={toolCallId}>
//                 Tool call {`${toolInvocation.toolName}: `}
//                 {toolInvocation.result}
//               </div>
//             ) : (
//               <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
//             );
//           })}
//           <br />
//         </div>
//       ))}

//       <form onSubmit={handleSubmit}>
//         <input value={input} onChange={handleInputChange} />
//       </form>
//     </>
//   );
// }

// "use client"

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { generateTypeScript } from './actions/generateTypescript'

// export default function Home() {
//   const [prompt, setPrompt] = useState('')
//   const [generatedCode, setGeneratedCode] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   // Function to filter valid TypeScript code
//   const extractTypeScriptCode = (result) => {
//     const codeBlockMatch = result.match(/```typescript([\s\S]*?)```/); // Look for TypeScript code block
//     return codeBlockMatch ? codeBlockMatch[1].trim() : result.trim(); // Extract code or return raw result
//   }

//   const handleSaveFile = async (fileName:string, code: string) => {
//       try {
//           const response = await fetch('/api/saveFile', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ fileName, code }),
//           });

//           const result = await response.json();
//           if (response.ok) {
//               alert(result.message);
//           } else {
//               alert(`Error: ${result.message}`);
//           }
//       } catch (error) {
//           console.error('Error:', error);
//           alert('An unexpected error occurred.');
//       }
//   };

//   const handleGenerate = async () => {
//     setIsLoading(true)
//     try {
//       const result = await generateTypeScript(prompt)
//       const filteredCode = extractTypeScriptCode(result) // Process generated code
//       await handleSaveFile("DynamicComponent.tsx",filteredCode)

//       setGeneratedCode(filteredCode)
//     } catch (error) {
//       console.error('Error generating TypeScript code:', error)
//       setGeneratedCode('Error generating code. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">TypeScript Code Generator</h1>
//       <div>
//         <div>
//           <Input
//             type="text"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="E.g., Create an interface for a User with name, age, and email properties"
//             className="mb-4"
//           />
//           <Button onClick={handleGenerate} disabled={isLoading}>
//             {isLoading ? 'Generating...' : 'Generate TypeScript'}
//           </Button>
//         </div>
//         {generatedCode && (
//           <div className="flex flex-col items-start mt-4">
//             <h3 className="text-lg font-semibold mb-2">Generated TypeScript Code:</h3>
//             <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto w-full">
//               <code>{generatedCode}</code>
//             </pre>
//           </div>
//         )}
//       </div>
//       {/* <DynamicComponent suggestions={exampleProps.suggestions}/> */}
//     </div>
//   )
// }

// "use client";

// import { experimental_useObject as useObject } from "ai/react";
// import { z } from "zod";

// const SelectedComponentSchema = z.object({
//   componentName: z.string(),
//   schema: z.any(),
// });

// export default function Page() {
//   const { object, submit, isLoading, stop } = useObject({
//     api: "/api/use-object",
//     schema: SelectedComponentSchema,
//   });
//   console.log(object);

//   return (
//     <div>
//       <button
//         onClick={() => submit("Messages during finals week.")}
//         disabled={isLoading}
//       >
//         Generate notifications
//       </button>

//       {isLoading && (
//         <div>
//           <div>Loading...</div>
//           <button type="button" onClick={() => stop()}>
//             Stop
//           </button>
//         </div>
//       )}
//       {object?.componentName}
//     </div>
//   );
// }








"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import Link from "next/link";
import { BotIcon, UserIcon } from "lucide-react";

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    { title: "View all", label: "my cameras", action: "View all my cameras" },
    { title: "Show me", label: "my smart home hub", action: "Show me my smart home hub" },
    {
      title: "How much",
      label: "electricity have I used this month?",
      action: "Show electricity usage",
    },
    {
      title: "How much",
      label: "water have I used this month?",
      action: "Show water usage",
    },
  ];

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          // ref={messagesContainerRef}
          className="flex flex-col gap-3 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && (
            <div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <span>+</span>
                </p>
                <p>
                  The streamUI function allows you to stream React Server
                  Components along with your language model generations to
                  integrate dynamic user interfaces into your application.
                </p>
                <p>
                  {" "}
                  Learn more about the{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components"
                    target="_blank"
                  >
                    streamUI{" "}
                  </Link>
                  hook from Vercel AI SDK.
                </p>
              </div>
            </div>
          )}
          {messages.map((message) => message)}
          <div />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((action, index) => (
              <div
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    setMessages((messages) => [
                      ...messages,
                      <div
                        key={messages.length}
                        role="user"
                        content={action.action}
                      />,
                    ]);
                    const response: ReactNode = await sendMessage(
                      action.action,
                    );
                    setMessages((messages) => [...messages, response]);
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);
            setInput("");

            const response: ReactNode = await sendMessage(input);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}



export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}

    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {content}
        </div>
      </div>
    </div>
  );
};