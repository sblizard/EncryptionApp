import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { generatekeys } from "../create user/generatekeys";
import Greeting from "./components/Greeting";
import ConversationList from "./components/ConversationList";
import { User, RSAUser, Message } from "./components/types";

export default async function ProtectedPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select()
        .or(`to_user.eq.${user.id},from_user.eq.${user.id}`)
        .order('sent_at', { ascending: true })

    if (messageError) {
        console.error("Error fetching messages:", messageError);
    } else {
        // console.log("Messages:", messageData);
    }

    const messages: Message[] = JSON.parse(JSON.stringify(messageData));

    console.log("Messages:", messages);

    const users = await supabase
        .from('RSA_public_keys')
        .select("*");

    let usersList: RSAUser[] = [];

    if (users.data) {
        for (let i = 0; i < users.data.length; i++) {
            usersList.push(JSON.parse(JSON.stringify(users.data[i])));
        }
    }

    console.log("Users:", usersList);

    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);

    if (error) {
        console.error("Error fetching user data: ", error);
        return null;
    }

    if (data && data.length > 0) {
        const dbUser: User = data[0];

        if (dbUser.RSA_prime_1 === null || dbUser.RSA_prime_2 === null) {
            // console.log("Generating keys");
            await generatekeys(dbUser.id, dbUser.email);
        } else {
            // console.log("Keys already exist");
        }

        return (
            <div className="dashboard-container flex flex-col gap-8 p-6">
                <Greeting userName={user.email ? user.email : "cryptologist"}/>
                <h2 className="text-xl font-medium">Your RSA Encrypted Conversations:</h2>
                <ConversationList conversations={usersList}/>
            </div>
        );
    } else {
        console.error("No user found in the database with the specified ID.");
        return null;
    }
}