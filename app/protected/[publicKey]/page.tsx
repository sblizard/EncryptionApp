import { createClient } from "@/utils/supabase/server";
import { User, Message } from "@/app/protected/components/types";

export default async function Chat({ params }: { params: { publicKey: string } }) {
    const { publicKey } = params;
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
        console.error("User not authenticated.");
        return null;
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
        .from("RSA_public_keys")
        .select()
        .eq("key", publicKey);

    if (error || !data || data.length === 0) {
        console.error("Error fetching user data or no user found:", error);
        return null;
    }
    const friend: User = data[0];

    const { data: sentMessagesData } = await supabase
        .from("messages")
        .select()
        .eq("from_user", friend.id)
        .eq("to_user", userId)
        .order("sent_at", { ascending: true });

    const { data: receivedMessagesData } = await supabase
        .from("messages")
        .select()
        .eq("from_user", userId)
        .eq("to_user", friend.id)
        .order("sent_at", { ascending: true });

    const sentMessages = sentMessagesData || [];
    const receivedMessages = receivedMessagesData || [];

    const allMessages = [...sentMessages, ...receivedMessages];
    const messageHistory = allMessages.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());

    console.log("Message history:", messageHistory);

    return (
        <div>
            <h1>Chat with {friend.email}</h1>
            <p>Public Key: {publicKey}</p>
            <div>
                {messageHistory.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    <ul>
                        {messageHistory.map((msg) => (
                            <li key={msg.id}>
                                <strong>{msg.from_user === userId ? "You" : friend.email}:</strong> {msg.message}
                                <span style={{ marginLeft: "8px", color: "gray" }}>
                                    {new Date(msg.sent_at).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}