import { useState } from 'react';

export default function NewConversation({
                                            onNewConversation,
                                        }: {
    onNewConversation: (conversation: { id: number; name: string; lastMessage: string }) => void;
}) {
    const [newConversationName, setNewConversationName] = useState('');

    const handleCreate = () => {
        if (!newConversationName) return;

        const newConversation = {
            id: Date.now(), // Temporary ID, replace with real backend ID
            name: newConversationName,
            lastMessage: '',
        };

        onNewConversation(newConversation);
        setNewConversationName('');
    };

    return (
        <div className="new-conversation">
            <h2 className="text-lg font-medium">Start a New Conversation</h2>
            <input
                type="text"
                placeholder="Conversation Name"
                value={newConversationName}
                onChange={(e) => setNewConversationName(e.target.value)}
                className="border rounded p-2 w-full mt-2"
            />
            <button
                onClick={handleCreate}
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
                Create
            </button>
        </div>
    );
}