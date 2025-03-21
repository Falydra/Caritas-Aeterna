import { PageProps } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import Layout from "@/Components/Layout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import { motion } from "framer-motion";
import Register from "./Register";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const handleGetStartedClick = () => {
        setShowLoginForm(true);
    };

    const handleGetStartedClickSignUp = () => {
        setShowSignUpForm(true);
    };
    return (
        <Layout>
            <Head title="Login - Magistra" />
            <div className="h-screen overflow-y-hidden font-sans w-full flex flex-row ">

                <div className="w-full h-full flex flex-col items-center justify-center bg-primary-fg"></div>

                <div className="w-3/4 h-full flex flex-col items-center justify-center bg-gradient-to-r  from-[#221e24] to-primary-bg">
                    {!showLoginForm && !showSignUpForm && (
                        <div className="flex flex-col items-center justify-start">
                            <h1 className="text-3xl font-bold text-center text-primary-fg">
                                Caritas Aeterna
                            </h1>
                            <div className="flex flex-row items-center justify-center gap-8">
                                <div
                                    onClick={handleGetStartedClick}
                                    className="flex w-[150px] h-[50px] bg-primary-fg text-primary-bg rounded-xl mt-8 items-center justify-center text-md font-bold cursor-pointer"
                                >
                                    Login
                                </div>
                                <div
                                    onClick={handleGetStartedClickSignUp}
                                    className="flex w-[150px] h-[50px] bg-primary-fg text-primary-bg rounded-xl mt-8 items-center justify-center text-md font-bold cursor-pointer"
                                >
                                    Sign Up
                                </div>
                            </div>
                        </div>
                    )}
                    {showLoginForm && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex w-3/5 h-full flex-col items-start justify-center text-start"
                        >
                            <h1 className="text-2xl font-bold text-primary-fg">
                                Login
                            </h1>
                            <p className="text-sm text-primary-fg mb-8">
                                Before you start, please sign in with your
                                account!
                            </p>
                            <form onSubmit={submit} className="w-full">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full h-10 px-2"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full h-10 px-2"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex flex-row w-full items-center justify-between">
                                    <div className="block mt-4">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="ms-2 text-sm text-primary-fg">
                                                Remember me
                                            </span>
                                        </label>
                                    </div>
                                    <div className="block mt-4">
                                        <label className="flex items-end text-primary-fg">
                                            <Link href="/">
                                                <span className="ms-2 text-sm cursor pointer hover:text-indigo-500">
                                                    Don't have any account
                                                </span>
                                            </Link>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="underline text-sm text-primary-fg hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}

                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Log in
                                    </PrimaryButton>
                                </div>
                            </form>
                        </motion.div>
                    )}
                    {showSignUpForm && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex w-3/5 h-full flex-col items-start justify-center text-start"
                        >
                            <h1 className="text-2xl font-bold text-primary-fg">
                                Register
                            </h1>
                            <p className="text-sm text-primary-fg mb-8">
                                Before you start, please sign in with your
                                account!
                            </p>
                            <Register />
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
