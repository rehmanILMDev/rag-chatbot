"use client";

import ReactCompoUi from "@/components/ui/reactui";
import AgentsTool from "@/components/ui/tools";
import { useChat } from "ai/react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    maxToolRoundtrips: 4,
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">
                {m.role === "user" ? "Rehman: " : "AI: "}
              </div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {"calling tool: " + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div>
            <div className="flex space-x-2 justify-center items-center dark:invert">
              <span className="sr-only">Loading...</span>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
            </div>
            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => stop()}
            >
              stop
            </button>
          </div>
        )}

        {error && (
          <>
            <div>An error occurred.</div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>

  );
}




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