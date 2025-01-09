import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();

    try {
        const contentType = req.headers.get("content-type");

        let body: Record<string, string> = {};

        // Handle URL-encoded form submissions
        if (contentType?.includes("application/x-www-form-urlencoded")) {
            const formData = await req.text();
            body = Object.fromEntries(new URLSearchParams(formData));
        }
        // Handle JSON submissions (optional, if needed)
        else if (contentType?.includes("application/json")) {
            body = await req.json();
        } else {
            throw new Error("Unsupported content type");
        }

        const { messageText, userId, friendId, redirectUrl } = body;

        if (!messageText || !userId || !friendId || !redirectUrl) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Insert message into the database
        const { error } = await supabase.from("messages").insert({
            from_user: userId,
            to_user: friendId,
            message_text: messageText,
            sent_at: new Date().toISOString(),
        });

        if (error) {
            console.error("Error inserting message:", error);
            return new Response(
                JSON.stringify({ error: "Error inserting message" }),
                { status: 500 }
            );
        }

        // Redirect to the chat page
        return new Response(null, {
            status: 307,
            headers: {
                Location: redirectUrl,
            },
        });
    } catch (err) {
        console.error("Error handling POST request:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}