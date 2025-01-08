export type User = {
    id: string;
    created_at: string;
    email: string;
    RSA_prime_1: number | null;
    RSA_prime_2: number | null;
};

export type RSAUser = {
    id: string;
    key: number;
    email: string;
}

export type Message = {
    id: number;
    from_user: string;
    to_user: string;
    message: string;
    sent_at: string;
    policy: string;
}