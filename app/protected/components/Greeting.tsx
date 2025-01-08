export default function Greeting({ userName }: { userName: string }) {
    const greeting = `Hello, ${userName}!`;

    return (
        <div className="greeting text-lg font-bold">
            {greeting}
        </div>
    );
}