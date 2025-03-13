

import DonationHistory from "@/Components/DonationHistory";
import SelectedBooks from "@/Components/SelectedBooks";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function Page() {
    return (
        <Authenticated
            rightSidebarChildren={
                <>
                    <SelectedBooks />
                    <DonationHistory />
                   
                </>
            }
        >
            <div className="grid grid-cols-2 gap-4 w-full items-center justify-center py-4">
                <div className="w-10/12 h-[125px] rounded-xl bg-muted/50 mx-auto" />
                <div className="w-10/12 h-[125px] rounded-xl bg-muted/50 mx-auto" />
                <div className="w-10/12 h-[125px] rounded-xl bg-muted/50 mx-auto" />
                <div className="w-10/12 h-[125px] rounded-xl bg-muted/50 mx-auto" />
            </div>
            <div className="h-[450px] w-11/12 flex-1 rounded-xl bg-muted/50 self-center" />
        </Authenticated>
    );
}