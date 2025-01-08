import Link from "next/link";
import { RSAUser } from "@/app/protected/components/types";

export default function ConversationList({ conversations }: { conversations: RSAUser[] }) {
    return (
        <div className="conversation-list flex flex-col gap-4">
            {conversations.map((conv) => (
                <Link href={`/protected/${conv.key}`} key={conv.key}>
                    <div
                        className="conversation-item p-4 border rounded hover:shadow-md transition cursor-pointer"
                    >
                        <h3 className="font-medium">{conv.email}</h3>
                        <p className="text-sm text-gray-600">RSA Public Key: {conv.key}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}