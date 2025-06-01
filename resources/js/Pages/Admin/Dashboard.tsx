import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function AdminDashboard() {
    return (
        <Authenticated>
            <div className="text-primary-fg p-8 w-full h-full items-start flex flex-col justify-start gap-2">
                <h1 className="text-2xl font-bold">Recently Added Donation</h1>
                <p className="text-sm text-primary-fg/50">
                    This is a list of donations that have been recently added to the system.
                </p>
            </div>
        </Authenticated>
    );
}