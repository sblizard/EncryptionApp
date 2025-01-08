import {RSAUser} from "@/app/protected/components/types";

export default function ConversationList({conversations}: {
    conversations: RSAUser[];
}) {
    return (
        <div className="conversation-list flex flex-col gap-4">
            {conversations.map((conv) => (
                <div
                    key={conv.email}
                    className="conversation-item p-4 border rounded hover:shadow-md transition"
                >
                    <h3 className="font-medium">{conv.email}</h3>
                    <p className="text-sm text-gray-600">RSA Public Key: {conv.key}</p>
                </div>
            ))}
        </div>
    );
}