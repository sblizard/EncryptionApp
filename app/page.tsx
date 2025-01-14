export default function Landing() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
            <div className="max-w-5xl mx-auto text-center space-y-10">
                {/* Header */}
                <h1 className="text-5xl font-extrabold">
                    Private. Secure. Encrypted.
                </h1>
                <p className="text-lg text-muted-foreground">
                    Your messages, your privacy. Experience end-to-end encrypted
                    messaging built for secure and seamless communication.
                </p>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-muted rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Secure Encryption</h2>
                        <p className="text-muted-foreground">
                            End-to-end encryption ensures that only you and the recipient
                            can access your messages.
                        </p>
                    </div>
                    <div className="p-6 bg-muted rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Privacy Matters</h2>
                        <p className="text-muted-foreground">
                            Take control over your data and protect your privacy by choosing between encryption methods.
                        </p>
                    </div>
                    <div className="p-6 bg-muted rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Cross-Platform</h2>
                        <p className="text-muted-foreground">
                            Stay connected on any device, anywhere in the world.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}