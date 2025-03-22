import Hero from "@/Components/Hero";
import Guest from "@/Layouts/GuestLayout";
import Charity from "@/Components/Charity";

export default function Welcome() {
    return (
        <Guest>
            <Hero />
            <Charity/>

        </Guest>
    )
}