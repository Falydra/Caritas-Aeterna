import Hero from "@/Components/Hero";
import Guest from "@/Layouts/GuestLayout";
import Charity from "@/Components/Charity";
import News from "@/Components/News";
import Layanan from "@/Components/LayananLain";
import CharityNews from "@/Components/CharityNews";

export default function Welcome() {
    return (
        <Guest>
            <Hero />
            <Charity/>
            <News isMoreNews={true}/>
            <CharityNews/>
            <Layanan/>

        </Guest>
    )
}
