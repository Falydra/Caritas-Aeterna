import { Link } from "@inertiajs/react";
import { IoIosArrowForward } from "react-icons/io";
import CardNews from "./GeneralCardNews";
import { useRef } from "react";

export default function News({isMoreNews = false} : {isMoreNews?: boolean}) {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div ref={ref} id="news" className="flex flex-col items-center w-full min-h-screen justify-start pt-12">
            <h1 className="text-2xl font-bold">Program Universitas Diponegoro</h1>
            <CardNews isMore={isMoreNews} />
        
        </div>
    )
}