import Hero from "@/Components/Hero";
import Guest from "@/Layouts/GuestLayout";
import Charity from "@/Components/Charity";
import News from "@/Components/News";
import Layanan from "@/Components/LayananLain";

export default function Welcome() {
    return (
        <Guest>
            <Hero />
            <Charity/>
            <News/>
            <Layanan/>

        </Guest>
    )
}