import { createClient } from "@/utils/supabase/server";
import { User, Message } from "@/app/protected/components/types";
import { redirect } from "next/navigation";

export default async function Chat({
                                       params,
                                   }: {
    params: { publicKey: string };
}) {
    const { publicKey } = params;
    const supabase = await createClient();

    // Authenticate user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
        console.error("User not authenticated.");
        return redirect("/sign-in");
    }
    const userId = userData.user.id;

    // Fetch friend's data using public key
    const { data: friendData, error: friendError } = await supabase
        .from("RSA_public_keys")
        .select()
        .eq("key", publicKey);

    if (friendError || !friendData || friendData.length === 0) {
        console.error("Error fetching user data or no user found:", friendError);
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="bg-card shadow-md rounded-lg p-6 text-center">
                    <h1 className="text-2xl font-bold text-destructive">Chat</h1>
                    <p className="text-muted-foreground mt-2">
                        Could not find user with public key:{" "}
                        <span className="font-mono text-primary">{publicKey}</span>
                    </p>
                </div>
            </div>
        );
    }

    const friend: User = friendData[0];

    // Fetch sent and received messages
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

    // Combine and sort messages
    const messageHistory = [...sentMessages, ...receivedMessages].sort(
        (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
    );

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-4xl mx-auto bg-card shadow-md rounded-lg p-6 flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                    <h1 className="text-3xl font-bold mb-4">
                        Chat with {friend.email}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Public Key:{" "}
                        <span className="font-mono text-primary">{publicKey}</span>
                    </p>
                    <div className="mt-6">
                        {messageHistory.length === 0 ? (
                            <p className="text-muted-foreground">No messages yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {messageHistory.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className={`p-4 rounded-lg ${
                                            msg.from_user === userId
                                                ? "bg-muted text-muted-foreground self-end"
                                                : "bg-primary text-primary-foreground self-start"
                                        }`}
                                    >
                                        <p className="text-sm">
                                            {msg.from_user === userId
                                                ? "You"
                                                : friend.email}
                                            : {msg.message_text}
                                        </p>
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            {new Date(msg.sent_at).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* New Message Form */}
                <form
                    action={`/protected/${publicKey}/send`}
                    method="post"
                    className="mt-4 flex gap-2"
                >
                    <input type="hidden" name="userId" value={userId}/>
                    <input type="hidden" name="friendId" value={friend.id}/>
                    <input type="hidden" name="redirectUrl" value={`/protected/${publicKey}`}/>
                    <input
                    type="text"
                    name="messageText"
                        placeholder="Type your message..."
                        required
                        className="flex-1 px-4 py-2 border rounded-lg bg-muted text-muted-foreground placeholder-muted-foreground"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-foreground hover:text-primary transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export const dynamic = "force-dynamic";