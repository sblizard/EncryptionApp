import { eulerTotient } from "@/app/create user/generatekeys";
import { modularExponentiation } from "@/app/create user/generatekeys";

export function decryptRSA(cyphertext: string, prime1: number, prime2: number): string {
    let plaintext: string = '';

    let eulerTotientNumber = eulerTotient(prime1, prime2);
    const d: number = modularExponentiation(65537, eulerTotientNumber - 1, eulerTotientNumber);

    for (let i = 0; i < cyphertext.length; i++) {
        let charCode = cyphertext.charCodeAt(i);
        let decryptedCharCode = modularExponentiation(charCode, d, prime1 * prime2);
        plaintext += String.fromCharCode(decryptedCharCode);
    }

    return plaintext;
}

import {power} from "@/app/RSA/encrypt";

export function decrypt(cypherText: bigint[], d: bigint, n: bigint): string {
    return cypherText
        .map((charCode) => {
            const decryptedCode = power(charCode, d, n);
            return String.fromCharCode(Number(decryptedCode));
        })
        .join("");
}