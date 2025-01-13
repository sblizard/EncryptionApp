import {calculatePrivateExponent, encrypt} from "@/app/RSA/encrypt";
import {decrypt} from "@/app/RSA/decrypt";

export default function ProtectedPage() {
    const message = "Hello, world!";
    const p = 1559n;
    const q = 1663n;
    const n = p * q; // Public modulus
    const e = 65537n; // Public exponent
    const phi = (p - 1n) * (q - 1n); // Totient of n

    const d = calculatePrivateExponent(e, phi); // Private exponent
    console.log("Private Exponent (d):", d);

    // Encrypt
    const encrypted: string = encrypt(message, e, n);
    console.log("Encrypted (ciphertext):", encrypted);

    // Decrypt
    const decrypted: string = decrypt(encrypted, d, n);
    console.log("Decrypted (plaintext):", decrypted);

    return (
        <div>
            <h1>Testing RSA</h1>
            <p>Original Message: {message}</p>
            <p>Encrypted Message: {encrypted}</p>
            <p>Decrypted Message: {decrypted}</p>
        </div>
    );
}







