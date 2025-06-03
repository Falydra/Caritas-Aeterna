import { useForm, usePage, Link } from "@inertiajs/react"; // Link might be unused now
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useRef, useState } from "react";
import { Head } from '@inertiajs/react';

interface ProfilePageProps {
    user: User;
    auth: { user: User; roles: string };
    // mustVerifyEmail: boolean; // Removed
    // status?: string; // Removed, if only used for verification status
    [key: string]: any;
}

export default function Profile() {
    // const { user, mustVerifyEmail, status } = usePage<ProfilePageProps>().props; // Adjusted
    const { user } = usePage<ProfilePageProps>().props; // Removed mustVerifyEmail and status

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

    const submitProfileUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        patchProfile(route("donee.profile.update"));
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
            onSuccess: () => resetPassword(),
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
        <Authenticated
            header={
                <h2 className={`text-xl font-semibold leading-tight ${cardHeaderTextColor}`}>
                    Profil
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Update Profile Information */}
                    <div className={`${cardBgClass} p-4 shadow sm:rounded-lg sm:p-8`}>
                        <header>
                            <h2 className={sectionTitleClass}>
                                Informasi Profil
                            </h2>
                            <p className={`mt-1 text-sm ${cardParagraphTextColor}`}>
                                Perbarui informasi profil dan alamat email akun Anda.
                            </p>
                        </header>

                        <form onSubmit={submitProfileUpdate} className={formSectionClass}>
                            <label htmlFor="username" className={cardLabelTextColor}>
                                Nama Pengguna
                                <TextInput
                                    id="username"
                                    className={`${inputBaseClass} capitalize`}
                                    value={profileData.username}
                                    onChange={(e) => setProfileData("username", e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                                <InputError className="mt-1 text-xs" message={profileErrors.username} />
                            </label>

                            <label htmlFor="email" className={cardLabelTextColor}>
                                Email
                                <TextInput
                                    id="email"
                                    type="email"
                                    className={inputBaseClass}
                                    value={profileData.email}
                                    onChange={(e) => setProfileData("email", e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <InputError className="mt-1 text-xs" message={profileErrors.email} />
                            </label>

                            {/* REMOVED EMAIL VERIFICATION SECTION */}

                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={profileProcessing} className={confirmButtonClass}>
                                    Simpan Perubahan
                                </button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className={`text-sm ${cardParagraphTextColor}`}>Tersimpan.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>


                    {/* Update Password */}
                    <div className={`${cardBgClass} p-4 shadow sm:rounded-lg sm:p-8`}>
                        <header>
                            <h2 className={sectionTitleClass}>
                                Perbarui Kata Sandi
                            </h2>
                            <p className={`mt-1 text-sm ${cardParagraphTextColor}`}>
                                Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                            </p>
                        </header>

                        <form onSubmit={updatePassword} className={formSectionClass}>
                            <label htmlFor="current_password" className={cardLabelTextColor}>
                                Kata Sandi Saat Ini
                                <TextInput
                                    id="current_password"
                                    ref={currentPasswordInputRef}
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData("current_password", e.target.value)}
                                    type="password"
                                    className={inputBaseClass}
                                    autoComplete="current-password"
                                />
                                <InputError message={passwordErrors.current_password} className="mt-1 text-xs" />
                            </label>

                            <label htmlFor="new_password" className={cardLabelTextColor}>
                                Kata Sandi Baru
                                <TextInput
                                    id="new_password"
                                    ref={passwordInputRef}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData("password", e.target.value)}
                                    type="password"
                                    className={inputBaseClass}
                                    autoComplete="new-password"
                                />
                                <InputError message={passwordErrors.password} className="mt-1 text-xs" />
                            </label>

                            <label htmlFor="password_confirmation" className={cardLabelTextColor}>
                                Konfirmasi Kata Sandi
                                <TextInput
                                    id="password_confirmation"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData("password_confirmation", e.target.value) }
                                    type="password"
                                    className={inputBaseClass}
                                    autoComplete="new-password"
                                />
                                <InputError message={passwordErrors.password_confirmation} className="mt-1 text-xs" />
                            </label>

                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={passwordProcessing} className={confirmButtonClass}>
                                    Simpan Kata Sandi
                                </button>
                                <Transition
                                    show={passwordRecentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className={`text-sm ${cardParagraphTextColor}`}>Tersimpan.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    {/* Delete User */}
                    <div className={`${cardBgClass} p-4 shadow sm:rounded-lg sm:p-8`}>
                        <header>
                            <h2 className={sectionTitleClass}>
                                Hapus Akun
                            </h2>
                            <p className={`mt-1 text-sm ${cardParagraphTextColor}`}>
                                Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                            </p>
                        </header>

                        <div className="mt-6">
                            <button onClick={confirmUserDeletionModal} className={dangerButtonClass}>
                                Hapus Akun
                            </button>
                        </div>

                        <Modal show={confirmingUserDeletion} onClose={closeModal}>
                            <form onSubmit={deleteUser} className="p-6 flex flex-col gap-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Apakah Anda yakin ingin menghapus akun Anda?
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
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