// Encrypts a message using the RSA algorithm
// @param message The message to encrypt
// @param e The public exponent
// @param n The public key
export function encrypt(message: string, e: bigint, n: bigint): string {
    let encryptedMessage = '';
    Array.from(message).map((char) => {
        const charCode = BigInt(char.charCodeAt(0));
        encryptedMessage += power(charCode, e, n) + ",";
    });
    return encryptedMessage.substring(0, encryptedMessage.length - 1);
}

export function power(base: bigint, expo: bigint, mod: bigint): bigint {
    let res = 1n;
    base = base % mod;

    while (expo > 0n) {
        if (expo % 2n === 1n) {
            res = (res * base) % mod;
        }
        base = (base * base) % mod;
        expo = expo / 2n;
    }

    return res;
}

export function calculatePrivateExponent(e: bigint, phi: bigint): bigint {
    let t = 0n;
    let newT = 1n;
    let r = phi;
    let newR = e;

    while (newR !== 0n) {
        const quotient = r / newR;

        [t, newT] = [newT, t - quotient * newT];
        [r, newR] = [newR, r - quotient * newR];
    }

    if (r > 1n) {
        throw new Error("e is not invertible mod Φ(n)");
    }

    if (t < 0n) {
        t += phi;
    }

    return t;
}