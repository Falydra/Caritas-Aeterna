import { useForm, usePage, Link } from "@inertiajs/react"; // Link might be unused now
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User, UserProfile } from "@/types";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useRef, useState } from "react";
import { Head } from '@inertiajs/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import UpdatePasswordForm from "../Profile/Partials/UpdatePasswordForm";

interface ProfilePageProps {
    user: User;
    userProfile: UserProfile | null;
    auth: { user: User; roles: string };
   
    [key: string]: any;
}

export default function Profile() {
    // const { user, mustVerifyEmail, status } = usePage<ProfilePageProps>().props; // Adjusted
    const { user, userProfile } = usePage<ProfilePageProps>().props; // Removed mustVerifyEmail and status

    const cardBgClass = "bg-stone-850";
    const cardHeaderTextColor = "text-slate-100";
    const cardParagraphTextColor = "text-slate-300";
    const cardLabelTextColor = "text-slate-200";

    const inputBaseClass = `py-2 px-3 text-sm text-slate-100 placeholder-slate-400 bg-slate-700 border-slate-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-md mt-1 block w-full`;

    const sectionTitleClass = `text-2xl font-bold ${cardHeaderTextColor}`;
    const formSectionClass = "mt-6 flex flex-col gap-4";

    const confirmButtonClass = "p-2 px-4 w-auto rounded-md text-green-500 font-semibold border border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 transition-colors duration-100 disabled:opacity-50";
    const cancelButtonClass = "p-2 px-4 w-auto rounded-md text-slate-300 font-semibold border border-slate-500 hover:bg-slate-700 hover:border-slate-400 active:bg-slate-600 transition-colors duration-100 disabled:opacity-50";
    const dangerButtonClass = "p-2 px-4 w-auto rounded-md text-red-500 font-semibold border border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors duration-100 disabled:opacity-50";


    // Profile Update Form
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors, recentlySuccessful } = useForm({
        username: user.username || "",
        email: user.email || "",
    });


    //User Profile
    const {
        data: userProfileData,
        setData: setUserProfileData,
        patch: patchUserProfile,
        processing: userProfileProcessing,
        errors: userProfileErrors,
        recentlySuccessful: profileUpdateSuccess
    } = useForm({
        full_name: userProfile?.full_name || "",
        phone_number: userProfile?.phone_number || "",
        date_of_birth: userProfile?.date_of_birth || "",
        gender: userProfile?.gender || "",
        pp: userProfile?.profile_picture || "",
    });
    
    console.log(userProfile)
    const submitProfileUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        patchProfile(route("donor.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profile Berhasil Diubah")
            },   
        });
    };

    // Password Update Form
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const currentPasswordInputRef = useRef<HTMLInputElement>(null);

    const { data: passwordData, setData: setPasswordData, errors: passwordErrors, put: putPassword, reset: resetPassword, processing: passwordProcessing, recentlySuccessful: passwordRecentlySuccessful } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        putPassword(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                toast.success("Password Berhasil Diubah")
            },
            onError: (errors) => {
                if (errors.password) {
                    resetPassword("password", "password_confirmation");
                    passwordInputRef.current?.focus();
                }
                if (errors.current_password) {
                    resetPassword("current_password");
                    currentPasswordInputRef.current?.focus();
                }
            },
        });
    };

    // Delete User Form
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const deletePasswordInputRef = useRef<HTMLInputElement>(null);

    const { data: deleteData, setData: setDeleteData, delete: destroyUser, processing: deleteProcessing, reset: resetDelete, errors: deleteErrors, clearErrors } = useForm({
        password: "",
    });

    const confirmUserDeletionModal = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroyUser(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => deletePasswordInputRef.current?.focus(),
            onFinish: () => resetDelete(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        resetDelete();
    };


    return (
        <Authenticated>
            <Head title="Profil" />
            {/* Header */}
            <div className="flex flex-col items-start w-full gap-1 py-6">
                <h1 className="text-2xl font-bold self-center">Profil</h1>
                <p className="text-lg self-center">Kelola informasi akun Anda di sini</p>
            </div>
            <div className="flex w-full justify-center items-center pt-4 bg-primary-bg text-white">
                <div className="flex flex-col w-1/2 items-start self-center gap-6 px-8 py-4">


                    {/* Informasi Profil */}
                    <form onSubmit={submitProfileUpdate} className="w-full rounded-lg shadow-md flex flex-col gap-6 bg-primary-bg p-6 border border-white text">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                                Nama Pengguna
                            </label>
                            <Input
                                id="username"
                                type="text"
                                className={`text-primary-fg capitalize focus:text-primary-fg ${profileErrors.username ? 'border-red-500' : ''}`}
                                value={profileData.username}
                                onChange={(e) => setProfileData("username", e.target.value)}
                                required
                                autoComplete="username"
                            />
                            {profileErrors.username && <p className="text-red-500 text-xs mt-1">{profileErrors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                className={`text-primary-fg focus:text-primary-fg ${profileErrors.email ? 'border-red-500' : ''}`}
                                value={profileData.email}
                                onChange={(e) => setProfileData("email", e.target.value)}
                                required
                                autoComplete="email"
                            />
                            {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                        </div>

                        <Button type="submit" disabled={profileProcessing} className="w-full mt-2 bg-primary-accent">
                            {profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </form>

                    {/* Ubah Password */}
                    <form onSubmit={updatePassword} className="w-full rounded-lg shadow-md flex flex-col gap-6 bg-primary-bg p-6 border border-white">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-white mb-1">
                                Kata Sandi Saat Ini
                            </label>
                            <Input
                                id="current_password"
                                ref={currentPasswordInputRef}
                                type="password"
                                className={`text-primary-fg focus:text-primary-fg ${passwordErrors.current_password ? 'border-red-500' : ''}`}
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData("current_password", e.target.value)}
                                autoComplete="current-password"
                            />
                            {passwordErrors.current_password && <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>}
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-white mb-1">
                                Kata Sandi Baru
                            </label>
                            <Input
                                id="new_password"
                                ref={passwordInputRef}
                                type="password"
                                className={`text-primary-fg focus:text-primary-fg ${passwordErrors.password ? 'border-red-500' : ''}`}
                                value={passwordData.password}
                                onChange={(e) => setPasswordData("password", e.target.value)}
                                autoComplete="new-password"
                            />
                            {passwordErrors.password && <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-white mb-1">
                                Konfirmasi Kata Sandi
                            </label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                className={`text-primary-fg focus:text-primary-fg ${passwordErrors.password_confirmation ? 'border-red-500' : ''}`}
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData("password_confirmation", e.target.value)}
                                autoComplete="new-password"
                            />
                            {passwordErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation}</p>}
                        </div>

                        <Button type="submit" disabled={passwordProcessing} className="w-full mt-2 bg-primary-accent">
                            {passwordProcessing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                        </Button>
                    </form>

                    {/* User Profile */}
                    <form onSubmit={submitProfileUpdate} className="w-full rounded-lg shadow-md flex flex-col gap-6 bg-primary-bg p-6 border border-white text">
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-white mb-1">
                                Nama Lengkap
                            </label>
                            <Input
                                id="full_name"
                                type="text"
                                className={`text-primary-fg capitalize focus:text-primary-fg ${userProfileErrors.full_name ? 'border-red-500' : ''}`}
                                value={userProfileData.full_name}
                                onChange={(e) => setUserProfileData("full_name", e.target.value)}
                                required
                                autoComplete="name"
                            />
                            {userProfileErrors.full_name && <p className="text-red-500 text-xs mt-1">{userProfileErrors.full_name}</p>}
                        </div>

                        {/* Nomor Handphone */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-white mb-1">
                                Nomor Handphone
                            </label>
                            <Input
                                id="phone_number"
                                type="tel"
                                className={`text-primary-fg focus:text-primary-fg ${userProfileErrors.phone_number ? 'border-red-500' : ''}`}
                                value={userProfileData.phone_number}
                                onChange={(e) => setUserProfileData("phone_number", e.target.value)}
                                required
                                autoComplete="tel"
                            />
                            {userProfileErrors.phone_number && <p className="text-red-500 text-xs mt-1">{userProfileErrors.phone_number}</p>}
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label htmlFor="birth_date" className="block text-sm font-medium text-white mb-1">
                                Tanggal Lahir
                            </label>
                            <Input
                                id="birth_date"
                                type="date"
                                className={`text-primary-fg focus:text-primary-fg ${userProfileErrors.date_of_birth ? 'border-red-500' : ''}`}
                                value={userProfileData.date_of_birth}
                                onChange={(e) => setUserProfileData("date_of_birth", e.target.value)}
                                required
                                autoComplete="bday"
                            />
                            {userProfileErrors.date_of_birth && <p className="text-red-500 text-xs mt-1">{userProfileErrors.date_of_birth}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">
                                Gender
                            </label>
                            <select
                                id="gender"
                                className={`text-primary-fg focus:text-primary-fg rounded-md border border-white px-3 py-2 bg-primary-bg ${userProfileErrors.gender ? 'border-red-500' : ''}`}
                                value={userProfileData.gender}
                                onChange={(e) => setUserProfileData("gender", e.target.value)}
                                required
                            >
                                <option value="">Pilih Gender</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                            {userProfileErrors.gender && <p className="text-red-500 text-xs mt-1">{userProfileErrors.gender}</p>}
                        </div>

                        {/* Foto Profil */}
                        {/* <div>
                            <label htmlFor="pp" className="block text-sm font-medium text-white mb-1">
                                Foto Profil (URL)
                            </label>
                            <Input
                                id="pp"
                                type="url"
                                className={`text-primary-fg focus:text-primary-fg ${userProfileErrors.pp ? 'border-red-500' : ''}`}
                                value={userProfileData.pp}
                                onChange={(e) => setUserProfileData("pp", e.target.value)}
                                required
                                autoComplete="photo"
                            />
                            {userProfileErrors.pp && <p className="text-red-500 text-xs mt-1">{userProfileErrors.pp}</p>}
                        </div> */}

                        <Button type="submit" disabled={userProfileProcessing} className="w-full mt-2 bg-primary-accent">
                            {userProfileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </form>


                    {/* Hapus Akun */}
                    <div className="w-full rounded-lg shadow-md flex flex-col gap-4 bg-primary-bg p-6 border border-white">
                        <h2 className="text-xl font-semibold text-white">Hapus Akun</h2>
                        <p className="text-sm text-white">
                            Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Harap unduh data penting Anda terlebih dahulu.
                        </p>
                        <Button onClick={confirmUserDeletionModal} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                            Hapus Akun
                        </Button>
                        <Modal show={confirmingUserDeletion} onClose={closeModal}>
                            <form onSubmit={deleteUser} className="p-6 flex flex-col gap-4 bg-primary-bg">
                                <h2 className="text-lg font-medium text-white">
                                    Apakah Anda yakin ingin menghapus akun Anda?
                                </h2>
                                <p className="mt-1 text-sm text-white">
                                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Harap masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                                </p>

                                <div className="mt-2">
                                    <label htmlFor="modal_password_delete" className="sr-only">Kata Sandi</label>
                                    <TextInput
                                        id="modal_password_delete"
                                        type="password"
                                        name="password"
                                        ref={deletePasswordInputRef}
                                        value={deleteData.password}
                                        onChange={(e) => setDeleteData("password", e.target.value)}
                                        className={`${inputBaseClass} w-3/4`}
                                        placeholder="Kata Sandi"
                                        isFocused
                                    />
                                    <InputError message={deleteErrors.password} className="mt-1 text-xs" />
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={closeModal} className={cancelButtonClass}>
                                        Batal
                                    </button>
                                    <button type="submit" className={dangerButtonClass} disabled={deleteProcessing}>
                                        Hapus Akun
                                    </button>
                                </div>
                                
                            </form>
                        </Modal>
                    </div>
                    
                </div>
            </div>
        </Authenticated>

    );
}