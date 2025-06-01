import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function BookDonors() {
    return (
        <Authenticated>
        {/* <div className="flex flex-col w-full h-full items-center justify-center"> */}
            <div id="payment" className="flex flex-col w-full items-start justify-end px-8 py-4">
                <h1 className="text-primary-fg self-start flex text-2xl flex-row items-center justify-end font-semibold hover:text-primary-accent">
                    Donors
                </h1>
            </div>
        {/* </div> */}
        </Authenticated>
    );
}