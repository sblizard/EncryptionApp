import {generatePrimes, stopOnValue} from 'prime-lib';
import {createClient} from "@/utils/supabase/server";

export async function generatekeys(uuid: string, email: string) {
     const i = generatePrimes();
     const s = stopOnValue(i, 2000);

     // @ts-ignore
    const values = [...s];

    console.log("values: ", values)

    let prime1 = values[Math.floor(Math.random() * 203 + 100)]
    let prime2 = values[Math.floor(Math.random() * 203 + 100)]

    console.log("prime1: ", prime1)
    console.log("prime2: ", prime2)

    const publicKey = prime1 * prime2;

    console.log("public key: ", publicKey)

    while (gcdStein(eulerTotient(prime1, prime2), 65537) !== 1) {
        prime1 = values[Math.floor(Math.random() * 203 + 100)]
        prime2 = values[Math.floor(Math.random() * 203 + 100)]
    }

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

    const e = 65537;

    const totient = eulerTotient(prime1, prime2);
    const decryptionExponent = modularExponentiation(e, totient - 1, totient);

    console.log("decryptionExponent: ", decryptionExponent)

    const { error: insertError } = await supabase
        .from('RSA_public_keys')
        .insert({ id: uuid, key: publicKey, decryption_exponent: decryptionExponent, email: email });

    if (insertError) {
        console.log("Error inserting into RSA_public_keys: ", insertError);
    } else {
        console.log("Public key inserted successfully.");
    }
}

function gcdStein(a: number, b: number) {
    if (a === 0) return b;
    if (b === 0) return a;

    let shift = 0;
    while (((a | b) & 1) === 0) {
        a >>= 1;
        b >>= 1;
        shift++;
    }
    while ((a & 1) === 0) {
        a >>= 1;
    }

    while (b !== 0) {
        while ((b & 1) === 0) {
            b >>= 1;
        }
        if (a > b) {
            [a, b] = [b, a];
        }
        b = b - a;
    }
    return a << shift;
}

function eulerTotient(p: number, q: number) {
    return (p - 1) * (q - 1);
}

export function modularExponentiation(base: number, exponent: number, modulus: number): number {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;

    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }

        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }

    return result;
}