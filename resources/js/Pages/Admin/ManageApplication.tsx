// Admin/ManageApplication.tsx

import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User, UserIdentity, UserProfile } from "@/types";
import { usePage, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react"; // Import useEffect
import { FaTimes, FaSpinner } from "react-icons/fa"; // Added FaSpinner for loading


interface ApplicationItem {
    id: number;
    donor_id: number;
    donor_username: string;
    status: string;
    reviewed_by: number | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
}

type CurrentPageProps = {
    applications: {
        data: ApplicationItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    auth: {
        user?: User;
        roles?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    [key: string]: any;
};

interface DonorDetails {
    id: number;
    email: string;
    username: string;
    type: string;
    role_class: string;
    role_name: string;
    is_admin: boolean;
    is_verified: boolean;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    has_profile: boolean;
    has_identity: boolean;
    profile: UserProfile;
    identity: UserIdentity;
}


export default function ManageApplication() {
    const { applications, auth, flash, errors } = usePage<CurrentPageProps>().props;
    console.log(applications)

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);

    // --- STATE FOR FETCHED DONOR DETAILS ---
    const [detailedDonorInfo, setDetailedDonorInfo] = useState<DonorDetails | null>(null);
    const [isLoadingDonorDetails, setIsLoadingDonorDetails] = useState(false);
    const [donorDetailError, setDonorDetailError] = useState<string | null>(null);


    const handleRowClick = (application: ApplicationItem) => {
        setSelectedApplication(application);
        setDetailedDonorInfo(null); // Clear previous donor details
        setDonorDetailError(null);  // Clear previous errors
        setIsModalOpen(true);
        // Fetching will be triggered by useEffect below
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
        setDetailedDonorInfo(null); // Clear details when modal closes
        setDonorDetailError(null);
    };

    // --- useEffect TO FETCH DONOR DETAILS WHEN MODAL OPENS ---
    useEffect(() => {
        if (isModalOpen && selectedApplication?.donor_id) {
        setIsLoadingDonorDetails(true);
        setDonorDetailError(null);

        const userIdToFetch = selectedApplication.donor_id;
        const url = route('admin.manage-application.user-detail', { userId: userIdToFetch });
        console.log("Fetching URL:", url); // <--- ADD THIS LOG
        console.log("Fetching for donor_id:", userIdToFetch); // <--- AND THIS

            fetch(url)
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({})); // Try to parse error JSON
                        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                    }
                    console.log(res)
                    return res.json();
                })
                .then((data) => {
                    if (data.user_info) {
                        setDetailedDonorInfo(data.user_info);
                    } else {
                        throw new Error(data.error || "User info not found in response.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching donor details:", error);
                    setDonorDetailError(error.message || "Failed to load donor details.");
                })
                .finally(() => {
                    setIsLoadingDonorDetails(false);
                });
        }
    }, [isModalOpen, selectedApplication]);


    const handleUpdateStatus = (applicationId: number, newStatus: 'accept' | 'deny') => {
        // router.patch(route('doneeapplication.update'), { // Original
        router.patch(route('doneeapplication.update'), {
            application_id: applicationId,
            status: newStatus,
            admin_id: auth.user?.id,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Update successful, page props:', page.props);
                closeModal();
            },
            onError: (errors) => { // errors object contains validation or other errors
                console.error('Error updating application status:', errors);
            }
        });
    };


    return (
        <Authenticated
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage Applications</h2>}
        >
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold text-primary-fg">Application Manager</h1>
                <p className="text-lg text-primary-fg">Manage all submitted donee applications.</p>

                {flash?.success && (
                    <div className="mb-4 w-full p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                        {flash.success}
                    </div>
                )}
                {errors && Object.keys(errors).length > 0 && (
                     <div className="mb-4 w-full p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                        {Object.entries(errors).map(([key, value]) => (
                            <p key={key}>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                        ))}
                    </div>
                )}

                {/* ... (Table structure remains the same) ... */}
                <div className="flex flex-col w-full items-center justify-center">
                    <div className='w-full max-h-[calc(100vh-280px)] overflow-y-auto rounded-md border border-primary-fg'>
                        <table className="w-full text-center ">
                            <thead className='sticky top-0 p-8 bg-primary-bg border-b border-primary-fg bg-opacity-35 z-10'>
                                <tr className='p-8 bg-primary-accent/50'>
                                    {/* ... (ths are the same) ... */}
                                    <th className='py-3 border-b border-primary-fg'>No</th>
                                    <th className='py-3 border-b border-primary-fg'>App ID</th>
                                    <th className='py-3 border-b border-primary-fg'>Donor ID</th>
                                    <th className='py-3 border-b border-primary-fg'>Donor Username</th>
                                    <th className='py-3 border-b border-primary-fg'>Status</th>
                                    <th className='py-3 border-b border-primary-fg'>Reviewed By (Admin ID)</th>
                                    <th className='py-3 border-b border-primary-fg'>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody className='text-center bg-primary-bg dark:bg-gray-800'> {/* Changed bg-white to bg-primary-bg for consistency */}
                                {applications.data.length > 0 ? applications.data.map((application: ApplicationItem, index: number) => (
                                    <tr
                                        key={application.id}
                                        className='text-primary-fg hover:bg-primary-accent/20 cursor-pointer' // Added cursor-pointer and adjusted hover
                                        onClick={() => handleRowClick(application)} // Attach click handler
                                    >
                                        {/* ... (tds are the same) ... */}
                                        <td className='p-4 border-b border-primary-fg'>{(applications.current_page - 1) * applications.per_page + index + 1}</td>
                                        <td className='p-4 border-b border-primary-fg'>{application.id}</td>
                                        <td className='p-4 border-b border-primary-fg'>{application.donor_id}</td>
                                        <td className='p-4 border-b border-primary-fg'>{application.donor_username}</td>
                                        <td className='p-4 border-b border-primary-fg'>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                ${application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                                ${application.status === 'denied' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                            `}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className='p-4 border-b border-primary-fg'>{application.reviewed_by || 'N/A'}</td>
                                        <td className='p-4 border-b border-primary-fg'>{new Date(application.created_at).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-400"> {/* Adjusted colSpan since Actions column was removed from header */}
                                            No pending applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {applications.data.length > 0 && (
                    <div className=" flex justify-between items-center sticky bottom-0 z-9 w-full py-4 bg-primary-bg border-t border-primary-fg">
                        {applications.current_page > 1 ? (
                            <Link
                                href={route("admin.manage-application", { page: applications.current_page - 1 })}
                                preserveScroll
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                as="button"
                            >
                                Previous
                            </Link>
                        ) : (
                            <span className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded cursor-not-allowed">
                                Previous
                            </span>
                        )}
                        <span className="text-primary-fg">
                            Halaman {applications.current_page} dari {applications.last_page}
                        </span>
                        {applications.current_page < applications.last_page ? (
                            <Link
                                href={route("admin.manage-application", { page: applications.current_page + 1 })}
                                preserveScroll
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                as="button"
                            >
                                Next
                            </Link>
                        ) : (
                            <span className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded cursor-not-allowed">
                                Next
                            </span>
                        )}
                    </div>
                )}


                {/* --- MODAL COMPONENT - UPDATED TO SHOW DONOR DETAILS --- */}
                {isModalOpen && selectedApplication && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"> {/* Increased bg-opacity */}
                        <div className="bg-primary-bg dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-primary-fg max-h-[90vh] overflow-y-auto"> {/* Increased max-w and added max-h with scroll */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-primary-fg">
                                    Application ID: {selectedApplication.id}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-primary-fg hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-primary-accent/20" // Added padding and hover bg
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* Application Details (Original) */}
                            <div className="mb-6 p-4 border border-primary-accent/30 rounded-md">
                                <h4 className="text-lg font-medium text-primary-fg mb-2">Application Summary</h4>
                                <div className="space-y-1 text-sm text-primary-fg">
                                    <p><strong>Status:</strong> {selectedApplication.status}</p>
                                    <p><strong>Submitted At:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</p>
                                    <p><strong>Reviewed By:</strong> {selectedApplication.reviewed_by || 'N/A'}</p>
                                    {selectedApplication.reviewed_at && <p><strong>Reviewed At:</strong> {new Date(selectedApplication.reviewed_at).toLocaleString()}</p>}
                                </div>
                            </div>

                            {/* Loading/Error state for Donor Details */}
                            {isLoadingDonorDetails && (
                                <div className="flex items-center justify-center py-4 mb-6">
                                    <FaSpinner className="animate-spin text-primary-accent mr-2" size={24} />
                                    <p className="text-primary-fg">Loading donor details...</p>
                                </div>
                            )}
                            {donorDetailError && (
                                <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md mb-6">Error: {donorDetailError}</p>
                            )}

                            {/* Donor Details Sections (only if loaded successfully) */}
                            {detailedDonorInfo && !isLoadingDonorDetails && !donorDetailError && (
                                <>
                                    {/* Section 1: Other Donor Information (Optional Box) */}
                                    <div className="mb-6 p-4 border border-primary-accent/30 rounded-md">
                                        <h4 className="text-lg font-medium text-primary-fg mb-3">Account Information</h4>
                                        <div className="space-y-1 text-sm text-primary-fg">
                                            <p><strong>Username:</strong> {detailedDonorInfo.username}</p>
                                            <p><strong>Email:</strong> {detailedDonorInfo.email} {detailedDonorInfo.is_verified ? <span className="text-green-500 text-xs">(Email Verified)</span> : <span className="text-yellow-500 text-xs">(Email Not Verified)</span>}</p>
                                            <p><strong>Role:</strong> {detailedDonorInfo.role_name}</p>
                                            {/* You can add more like created_at, updated_at if needed */}
                                        </div>
                                    </div>

                                    {/* Section 2: User Identity (Boxed) */}
                                    <div className="mb-6 p-4 border border-primary-accent/30 rounded-md">
                                        <h4 className="text-lg font-medium text-primary-fg mb-3">User Identity</h4>
                                        <div className="space-y-2 text-sm text-primary-fg">
                                            {detailedDonorInfo.identity ? (
                                                <>
                                                    <p><strong>NIK:</strong> {detailedDonorInfo.identity.nik}</p>
                                                    <p><strong>Full Name (Identity):</strong> {detailedDonorInfo.identity.full_name}</p>
                                                    {detailedDonorInfo.identity.id_card_image ? (
                                                        <p><strong>ID Card:</strong> <a href={detailedDonorInfo.identity.id_card_image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Image</a></p>
                                                    ) : (
                                                        <p><strong>ID Card:</strong> Not available</p>
                                                    )}
                                                    {detailedDonorInfo.identity.verified_at && <p><strong>Identity Verified:</strong> {new Date(detailedDonorInfo.identity.verified_at).toLocaleDateString()}</p>}
                                                </>
                                            ) : (
                                                <p>No identity information available.</p>
                                            )}
                                            {/* Gender and Phone from Profile */}
                                            {detailedDonorInfo.profile ? (
                                                <>
                                                    {detailedDonorInfo.profile.gender && <p><strong>Gender:</strong> {detailedDonorInfo.profile.gender}</p>}
                                                    {/* AGE DISPLAY REMOVED HERE */}
                                                    {detailedDonorInfo.profile.phone_number && <p><strong>Phone Number:</strong> {detailedDonorInfo.profile.phone_number}</p>}
                                                </>
                                            ) : (
                                                <>
                                                    <p>Gender, Phone: Profile data not available.</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Section 3: User Address (Boxed) */}
                                    <div className="mb-6 p-4 border border-primary-accent/30 rounded-md">
                                        <h4 className="text-lg font-medium text-primary-fg mb-3">User Address</h4>
                                        {detailedDonorInfo.identity?.address ? (
                                            <div className="space-y-1 text-sm text-primary-fg">
                                                {detailedDonorInfo.identity.address.address_detail && <p>{detailedDonorInfo.identity.address.address_detail}</p>}
                                                <p>
                                                    {detailedDonorInfo.identity.address.rt && `RT ${detailedDonorInfo.identity.address.rt}`}
                                                    {detailedDonorInfo.identity.address.rw && `/RW ${detailedDonorInfo.identity.address.rw}`}
                                                </p>
                                                {detailedDonorInfo.identity.address.kelurahan && <p>Kel. {detailedDonorInfo.identity.address.kelurahan}</p>}
                                                {detailedDonorInfo.identity.address.kecamatan && <p>Kec. {detailedDonorInfo.identity.address.kecamatan}</p>}
                                                <p>
                                                    {detailedDonorInfo.identity.address.city && `${detailedDonorInfo.identity.address.city}, `}
                                                    {detailedDonorInfo.identity.address.province && `${detailedDonorInfo.identity.address.province} `}
                                                    {detailedDonorInfo.identity.address.postal_code && `${detailedDonorInfo.identity.address.postal_code}`}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-primary-fg">No address information available.</p>
                                        )}
                                    </div>

                                </>
                            )}

                            {/* Actions for Pending Applications */}
                            {selectedApplication.status === 'pending' && (
                                <div className="mt-6 flex flex-col items-center space-y-3"> {/* Changed to flex-col, items-center, and space-y-3 */}
                                    {/* Accept Button (on top) */}
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApplication.id, 'accept')}
                                        className="w-full max-w-xs px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium" // Added w-full and max-w-xs for consistent width
                                        disabled={isLoadingDonorDetails}
                                    >
                                        Accept Application
                                    </button>

                                    {/* Deny Button (below) */}
                                    <button
                                        onClick={() => handleUpdateStatus(selectedApplication.id, 'deny')}
                                        className="w-full max-w-xs px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium" // Added w-full and max-w-xs for consistent width
                                        disabled={isLoadingDonorDetails}
                                    >
                                        Deny Application
                                    </button>
                                </div>
                            )}
                            {selectedApplication.status !== 'pending' && (
                                 <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Authenticated>
    );
}