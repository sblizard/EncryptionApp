import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { generatekeys } from "@/create user/generatekeys";

type User = {
    id: string;
    created_at: string;
    email: string;
    RSA_prime_1: number | null;
    RSA_prime_2: number | null;
};

export default async function ProtectedPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

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
            console.log("Generating keys");
            await generatekeys(dbUser.id);
        } else {
            console.log("Keys already exist");
        }

        const rsa1 = dbUser.RSA_prime_1;
        const rsa2 = dbUser.RSA_prime_2;

        return (
            <div className="flex-1 w-full flex flex-col gap-12">
                <h1 className="text-2xl font-medium">Protected Page</h1>
                <h2>Private keys:</h2>
                <p>{rsa1}, {rsa2}</p>

                <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
            </div>
        );
    } else {
        console.error("No user found in the database with the specified ID.");
        return null;
    }
}