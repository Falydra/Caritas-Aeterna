import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { toast } from "sonner";

export default function DoneeRegister() {
    const { auth } = usePage().props as any;
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
               
                router.reload();
                
                
                toast.success("Registration successful! Please wait for admin verification.");
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

    return (
        <Authenticated>
            <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Register as Donee</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Profile fields */}
                    <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" required />
                    <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" required />
                    <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="border p-2 rounded" required />
                    {/* Identity fields */}
                    <input name="nik" value={form.nik} onChange={handleChange} placeholder="NIK" className="border p-2 rounded" required maxLength={16} />
                    <input name="id_card_image" type="file" accept="image/*" onChange={handleChange} className="border p-2 rounded" required />
                    {/* Address fields */}
                    <input name="address_detail" value={form.address_detail} onChange={handleChange} placeholder="Address Detail" className="border p-2 rounded" required />
                    <input name="rt" value={form.rt} onChange={handleChange} placeholder="RT" className="border p-2 rounded" required />
                    <input name="rw" value={form.rw} onChange={handleChange} placeholder="RW" className="border p-2 rounded" required />
                    <input name="kelurahan" value={form.kelurahan} onChange={handleChange} placeholder="Kelurahan" className="border p-2 rounded" required />
                    <input name="kecamatan" value={form.kecamatan} onChange={handleChange} placeholder="Kecamatan" className="border p-2 rounded" required />
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" required />
                    <input name="province" value={form.province} onChange={handleChange} placeholder="Province" className="border p-2 rounded" required />
                    <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" className="border p-2 rounded" required />
                    <button type="submit" className="bg-primary-accent text-white px-4 py-2 rounded hover:bg-primary-accent/80">
                        Register as Donee
                    </button>
                    {Object.values(errors).map((err, i) => (
                        <div key={i} className="text-red-500 text-sm">{err as string}</div>
                    ))}
                </form>
            </div>
        </Authenticated>
    );
}