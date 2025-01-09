import { modularExponentiation } from "@/app/create user/generatekeys";

export function encryptRSA(message: string, publicKey: number, decryptionExponent: number) {
    let cypherText: string = ""

    for (let i = 0; i < message.length; i++) {
        let charCode = message.charCodeAt(i);
        let encrypted = modularExponentiation(charCode, publicKey, publicKey);
        console.log("encrypted: ", encrypted)
        cypherText += String.fromCharCode(encrypted)
    }

    console.log("cypherText: ", cypherText);

    return cypherText;
}