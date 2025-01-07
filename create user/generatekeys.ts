import {generatePrimes, stopOnValue} from 'prime-lib';
import {createClient} from "@/utils/supabase/server";

export async function generatekeys(uuid: string) {
     const i = generatePrimes();
     const s = stopOnValue(i, 2000);

     // @ts-ignore
    const values = [...s];

    console.log("values: ", values)

    const prime1 = values[Math.floor(Math.random() * 203 + 100)]
    const prime2 = values[Math.floor(Math.random() * 203 + 100)]

    console.log("prime1: ", prime1)
    console.log("prime2: ", prime2)

    const publicKey = prime1 * prime2;

    console.log("public key: ", publicKey)

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .update({ RSA_prime_1: prime1, RSA_prime_2: prime2 })
        .eq('id', uuid)

    if (error) {
        console.log(error)
    } else {
        console.log(data)
    }

    const { error: insertError } = await supabase
        .from('RSA_public_keys')
        .insert({ id: uuid, key: publicKey });

    if (insertError) {
        console.log("Error inserting into RSA_public_keys: ", insertError);
    } else {
        console.log("Public key inserted successfully.");
    }
}