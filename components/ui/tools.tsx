
'use client';

import { useState } from 'react';
import { Message, continueConversation } from '@/app/actions/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function AgentsTool() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button
          onClick={async () => {
            // const { messages } = await continueConversation([
            //   ...conversation,
            //   { role: 'user', content: input },
            // ]);
            await continueConversation([
                  ...conversation,
                  { role: 'user', content: input },
                ]);
            // setConversation(onmessages);
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

