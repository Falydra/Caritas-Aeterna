import CardNews from "./CardNews";
import { useRef } from "react";

export default function News() {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div ref={ref} id="news" className="flex flex-col items-center w-full min-h-screen justify-start py-16">
            <h1 className="text-2xl font-bold">Program Universitas Diponegoro</h1>
            <CardNews />
        </div>
    )
}