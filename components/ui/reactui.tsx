
'use client';

import { useState } from 'react';
import { ClientMessage } from '@/app/actions/reactcompoui';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
// import { ClientMessage } from '@/app/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function ReactCompoUi() {
    const [input, setInput] = useState<string>('');
    const [conversation, setConversation] = useUIState();
    const { continueConversation } = useActions();
console.log(conversation, "dgbbdgbdf");

    return (
        <div>
            <div>
                {conversation.map((message: ClientMessage) => (
                    <div key={message.id}>
                        {message.role}: {message.display}
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
            >
                <input
                    type="text"
                    value={input}
                    onChange={event => {
                        setInput(event.target.value);
                    }}
                />
                <button
                    onClick={async () => {
                        setConversation((currentConversation: ClientMessage[]) => [
                            ...currentConversation,
                            { id: generateId(), role: 'user', display: input },
                        ]);

                        const message = await continueConversation(input);

                        setConversation((currentConversation: ClientMessage[]) => [
                            ...currentConversation,
                            message,
                        ]);
                    }}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}