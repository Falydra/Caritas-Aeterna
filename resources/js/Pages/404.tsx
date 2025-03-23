import { Link } from "@inertiajs/react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-primary-bg text-primary-fg">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl mt-4">Halamannya belum ada, gw capek</p>
            <Link href="/" className="mt-6 text-primary-accent hover:underline">
                Lu Nyari Apa kocak
            </Link>
        </div>
    );
}