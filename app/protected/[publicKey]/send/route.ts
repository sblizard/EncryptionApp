import { createClient } from "@/utils/supabase/server";
import { encrypt } from "@/app/RSA/encrypt";

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
            console.log("Missing required fields\nmessageText: ", messageText, "\nuserId: ", userId, "\nfriendId: ", friendId, "\nredirectUrl: ", redirectUrl);
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const { data: friendEncryptData, error: friendEncryptError } = await supabase
            .from("RSA_public_keys")
            .select()
            .eq("id", friendId)

        let friendPublicKey: number = 0;
        let friendDecryptionExponent: number = 1;

        if (friendEncryptError) {
            console.error("Error fetching public key:", friendEncryptError);
            return new Response(
                JSON.stringify({ error: "Error fetching public key" }),
                { status: 500 }
            );
        } else {
            console.log("friendEncryptData: ", friendEncryptData)
            friendPublicKey = friendEncryptData[0].key;
            friendDecryptionExponent = friendEncryptData[0].decryption_exponent;
        }

        let friendCypherText = encrypt(messageText, 65537n, BigInt(friendPublicKey));

        // Insert message into the database
        const { error } = await supabase.from("messages").insert({
            from_user: userId,
            to_user: friendId,
            message_text: friendCypherText,
            sent_at: new Date().toISOString(),
        });

        if (error) {
            console.error("Error inserting message:", error);
            return new Response(
                JSON.stringify({ error: "Error inserting message" }),
                { status: 500 }
            );
        }

        const { data: selfEncryptData, error: selfEncryptError } = await supabase
            .from("RSA_public_keys")
            .select()
            .eq("id", userId)

        let selfPublicKey: number = 0;
        let selfDecryptionExponent: number = 1;

        if (selfEncryptError) {
            console.error("Error fetching public key:", selfEncryptError);
            return new Response(
                JSON.stringify({ error: "Error fetching public key" }),
                { status: 500 }
            );
        } else {
            console.log("selfEncryptData: ", selfEncryptData)
            selfPublicKey = selfEncryptData[0].key;
            selfDecryptionExponent = selfEncryptData[0].decryption_exponent;
        }

        let selfCypherText: string = encrypt(messageText, 65537n, BigInt(selfPublicKey));

        const { error: sentMessageError } = await supabase.from("sent_messages").insert({
            from_user: userId,
            to_user: friendId,
            message_text: selfCypherText,
            sent_at: new Date().toISOString(),
        });

        if (sentMessageError) {
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