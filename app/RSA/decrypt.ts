import {power} from "@/app/RSA/encrypt";

//public exponent e, private exponent d, and public key n
export function decrypt(cypherText: string, d: bigint, n: bigint): string {
    const cypherTextArray: string[] = cypherText.split(",");

    return cypherTextArray
        .map((charCode) => {
            const decryptedCode = power(BigInt(charCode), d, n);
            return String.fromCharCode(Number(decryptedCode));
        })
        .join("");
}