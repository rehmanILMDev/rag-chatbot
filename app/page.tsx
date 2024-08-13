"use client";

// import { useChat } from "ai/react";

// export default function Chat() {
//   const {
//     messages,
//     input,
//     handleInputChange,
//     handleSubmit,
//     isLoading,
//     error,
//     reload,
//     stop,
//   } = useChat({
//     maxToolRoundtrips: 2,
//   });

//   return (
//     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//       <div className="space-y-4">
//         {messages.map((m) => (
//           <div key={m.id} className="whitespace-pre-wrap">
//             <div>
//               <div className="font-bold">
//                 {m.role === "user" ? "Rehman: " : "AI: "}
//               </div>
//               <p>
//                 {m.content.length > 0 ? (
//                   m.content
//                 ) : (
//                   <span className="italic font-light">
//                     {"calling tool: " + m?.toolInvocations?.[0].toolName}
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//         ))}

//         {isLoading && (
//           <div>
//             <div className="flex space-x-2 justify-center items-center dark:invert">
//               <span className="sr-only">Loading...</span>
//               <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//               <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//               <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
//             </div>
//             <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"  onClick={() => stop()}>stop</button>

//           </div>
//         )}

//         {error && (
//           <>
//             <div>An error occurred.</div>
//             <button type="button" onClick={() => reload()}>
//               Retry
//             </button>
//           </>
//         )}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//           disabled={isLoading}
//         />
//       </form>
//     </div>
//   );
// }



export default function AudioPage() {
  const handlePlayAudio = async () => {
    try {
      const response = await fetch('/api/generate-audio');
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('Failed to fetch audio');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Generate and Play Audio</h1>
      <button onClick={handlePlayAudio}>Play Audio</button>
    </div>
  );
}
