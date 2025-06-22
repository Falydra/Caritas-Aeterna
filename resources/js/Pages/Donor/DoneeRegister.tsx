import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { User, UserProfile } from "@/types";


interface ProfilePageProps {
    user: User;
    userProfile: UserProfile | null;
    auth: { user: User; roles: string };

    [key: string]: any;
}

export default function DoneeRegister() {
    const { user, userProfile, auth } = usePage<ProfilePageProps>().props; // Removed mustVerifyEmail and status
    const [form, setForm] = useState({
        full_name: "",
        phone_number: "",
        gender: "",
        date_of_birth: "",
        nik: "",
        id_card_image: null as File | null,
        address_detail: "",
        rt: "",
        rw: "",
        kelurahan: "",
        kecamatan: "",
        city: "",
        province: "",
        postal_code: "",
    });
    useEffect(() => {
        if (userProfile) {
            setForm(prev => ({
                ...prev,
                full_name: userProfile.full_name || "",
                phone_number: userProfile.phone_number || "",
                gender: userProfile.gender || "",
                date_of_birth: userProfile.date_of_birth?.slice(0, 10) || "", // for <input type="date">
                nik: "",
                id_card_image: null as File | null,
                address_detail: "",
                rt: "",
                rw: "",
                kelurahan: "",
                kecamatan: "",
                city: "",
                province: "",
                postal_code: "",
            }));
        }
    }, [userProfile]);
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as any;
        setForm(f => ({
            ...f,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value as any);
        });
        console.log("Submitting form data:", formData);
        router.post(route("donor.donee-register"), formData, {
            onError: setErrors,
            onSuccess: () => {

                toast.success("Registration successful! Please wait for admin verification.");
                router.reload();


                setForm({
                    full_name: "",
                    phone_number: "",
                    gender: "",
                    date_of_birth: "",
                    nik: "",
                    id_card_image: null as File | null,
                    address_detail: "",
                    rt: "",
                    rw: "",
                    kelurahan: "",
                    kecamatan: "",
                    city: "",
                    province: "",
                    postal_code: "",
                });

            }
        });
    };

    console.log(form.id_card_image)
    console.log("HELLO");

    return (
        <Authenticated>
            {/* <Head title="Register as Donee" /> */}
            <div className="flex w-full justify-center items-center min-h-screen pt-8 pb-8 bg-primary-bg text-white">
                <div className="flex flex-col w-full md:w-3/4 lg:w-1/2 items-start self-center gap-4 px-6 md:px-8 py-4">
                    <div className="flex flex-col items-start w-full gap-1">
                        <h1 className="text-2xl font-bold self-center">Register as Donee</h1>
                        <p className="text-lg self-center text-gray-300">Please fill in the information below correctly.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full rounded-lg shadow-md flex flex-col gap-6 bg-primary-bg p-6 border border-white">
                        {/* Profile fields */}
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-white mb-1">
                                Full Name
                            </label>
                            <Input
                                id="full_name"
                                type="text"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={form.full_name}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.full_name ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-white mb-1">
                                Phone Number
                            </label>
                            <Input
                                id="phone_number"
                                type="tel"
                                name="phone_number"
                                placeholder="Enter your phone number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.phone_number ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={`w-full p-2.5 border rounded ${errors.gender ? 'border-red-500' : 'border-gray-600'} text-primary-fg focus:text-primary-fg bg-gray-700 focus:ring-1 focus:ring-primary-accent focus:border-primary-accent`}
                                required
                            >
                                <option value="" className="text-gray-400">Select Gender</option>
                                <option value="male" className="text-white bg-gray-700">Male</option>
                                <option value="female" className="text-white bg-gray-700">Female</option>
                                <option value="other" className="text-white bg-gray-700">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="date_of_birth" className="block text-sm font-medium text-white mb-1">
                                Date of Birth
                            </label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                name="date_of_birth"
                                value={form.date_of_birth}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.date_of_birth ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth as string}</p>}
                        </div>

                        {/* Identity fields */}
                        <div>
                            <label htmlFor="nik" className="block text-sm font-medium text-white mb-1">
                                NIK (National Identity Number)
                            </label>
                            <Input
                                id="nik"
                                type="text"
                                name="nik"
                                placeholder="Enter your NIK"
                                value={form.nik}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.nik ? 'border-red-500' : ''}`}
                                required
                                maxLength={16}
                            />
                            {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="id_card_image" className="block text-sm font-medium text-white mb-1">
                                ID Card Image
                            </label>
                            <Input
                                id="id_card_image"
                                type="file"
                                name="id_card_image"
                                accept="image/*"
                                onChange={handleChange} // Ensure handleChange handles e.target.files[0]
                                className={`text-primary-fg focus:text-primary-fg ${errors.id_card_image ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.id_card_image && <p className="text-red-500 text-xs mt-1">{errors.id_card_image as string}</p>}
                        </div>

                        {/* Address fields */}
                        <div>
                            <label htmlFor="address_detail" className="block text-sm font-medium text-white mb-1">
                                Address Detail
                            </label>
                            <Input
                                id="address_detail"
                                type="text" // Consider using <Textarea /> component if available and appropriate
                                name="address_detail"
                                placeholder="Street name, building, house number"
                                value={form.address_detail}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.address_detail ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.address_detail && <p className="text-red-500 text-xs mt-1">{errors.address_detail as string}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="rt" className="block text-sm font-medium text-white mb-1">RT</label>
                                <Input id="rt" type="text" name="rt" placeholder="RT" value={form.rt} onChange={handleChange} className={`text-primary-fg focus:text-primary-fg ${errors.rt ? 'border-red-500' : ''}`} required />
                                {errors.rt && <p className="text-red-500 text-xs mt-1">{errors.rt as string}</p>}
                            </div>
                            <div>
                                <label htmlFor="rw" className="block text-sm font-medium text-white mb-1">RW</label>
                                <Input id="rw" type="text" name="rw" placeholder="RW" value={form.rw} onChange={handleChange} className={`text-primary-fg focus:text-primary-fg ${errors.rw ? 'border-red-500' : ''}`} required />
                                {errors.rw && <p className="text-red-500 text-xs mt-1">{errors.rw as string}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="kelurahan" className="block text-sm font-medium text-white mb-1">
                                Kelurahan / Village
                            </label>
                            <Input
                                id="kelurahan"
                                type="text"
                                name="kelurahan"
                                placeholder="Enter Kelurahan / Village"
                                value={form.kelurahan}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.kelurahan ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.kelurahan && <p className="text-red-500 text-xs mt-1">{errors.kelurahan as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="kecamatan" className="block text-sm font-medium text-white mb-1">
                                Kecamatan / District
                            </label>
                            <Input
                                id="kecamatan"
                                type="text"
                                name="kecamatan"
                                placeholder="Enter Kecamatan / District"
                                value={form.kecamatan}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.kecamatan ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.kecamatan && <p className="text-red-500 text-xs mt-1">{errors.kecamatan as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
                                City / Regency
                            </label>
                            <Input
                                id="city"
                                type="text"
                                name="city"
                                placeholder="Enter City / Regency"
                                value={form.city}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.city ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-white mb-1">
                                Province
                            </label>
                            <Input
                                id="province"
                                type="text"
                                name="province"
                                placeholder="Enter Province"
                                value={form.province}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.province ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="postal_code" className="block text-sm font-medium text-white mb-1">
                                Postal Code
                            </label>
                            <Input
                                id="postal_code"
                                type="text"
                                name="postal_code"
                                placeholder="Enter Postal Code"
                                value={form.postal_code}
                                onChange={handleChange}
                                className={`text-primary-fg focus:text-primary-fg ${errors.postal_code ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code as string}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-2 bg-primary-accent hover:bg-primary-accent/90">
                            {/* Assuming a 'processing' state exists, similar to the target example */}
                            {/* {processing ? 'Registering...' : 'Register as Donee'} */}
                            Register as Donee {/* Simplified if 'processing' state is not used here */}
                        </Button>
                    </form>
                </div>
            </div>
        </Authenticated>
    );
}
