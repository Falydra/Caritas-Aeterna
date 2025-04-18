import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import DinoGame from "react-chrome-dino-ts";
import "react-chrome-dino-ts/index.css";

export default function NotFound() {
    interface ErrorProps extends PageProps {
        code: string;
        status: string;
        message: string;
    }

    const { code, status, message } = usePage<ErrorProps>().props;

    return (
        <div className="flex flex-col items-center justify-center overflow-x-auto h-screen bg-primary-bg text-primary-fg">
            {/* <DinoGame/> */}
            <h1 className="text-6xl font-bold">{code}</h1>
            <p className="text-2xl mt-4 capitalize">{status}</p>
            <Link
                href="/dashboard"
                className="mt-6 text-primary-accent hover:underline"
            >
                {message}
            </Link>
        </div>
    );
}
