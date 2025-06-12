import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { Inertia } from "@inertiajs/inertia";
import { usePage, router } from "@inertiajs/react";
import {
    Box,
    Button,
    capitalize,
    Chip,
    createTheme,
    Pagination,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import { useState } from "react";
import { toast } from "sonner";

const BackButton = styled(Button)(({ theme }) => ({
    color: grey["A200"],
    textTransform: "capitalize",
}));

declare module "@mui/material/styles" {
    interface Palette {
        edit: Palette["primary"];
        light: Palette["primary"];
    }

    interface PaletteOptions {
        edit?: PaletteOptions["primary"];
        light?: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        edit: true;
        light: true;
    }
}


const theme = createTheme({
    palette: {
        edit: {
            main: amber[400],
            light: amber[300],
            dark: amber[500],
            contrastText: grey[900],
        },
        light: {
            main: "#ffffff",
            light: "#ffffff",
            dark: grey[200],
            contrastText: grey[900],
        },
    },
});


interface Donation {
    id: number;
    initiator_id: number;
    type: string;
    title: string;
}

interface Donor {
    id: number;
    username: string;
}

interface DonorDonation {
    id: number;
    donor_id: number;
    donor: Donor;
}

interface DonationItem {
    id: number;
    donor_donation_id: number;
    product_amount: number;
    package_picture: string;
    resi: string;
    status: string;
    updated_at: string;
    donor_donation: DonorDonation;
}

interface paginatedDonationItem {
    data: DonationItem[];
    per_page: number;
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
}

interface ProductDonationData {
    donation: Donation;
    donation_item: paginatedDonationItem;
}

interface DonatedItemProps extends PageProps {
    auth: {
        user: User;
        roles: string;
    };
    data: ProductDonationData;
}

function formatDate(date: string) {
    return new Date(date).toISOString().replace("T", " ").slice(0, 19);
}

function formatStatus(status: string) {
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function DonatedItemList() {
    const { auth, data } = usePage<DonatedItemProps>().props;
    const paginatedProductData = (data as ProductDonationData).donation_item;

    const [packagePicturePreview, setPackagePicturePreview] = useState("");

    const handleBack = () => {
        Inertia.visit("/dashboard/donee");
    };

    const productDonationHeader = [
        "Nama Donatur",
        "Jumlah",
        "Status",
    ];
    const fundraisingHeader = ["Nama Donatur", "Jumlah", "Status"];

    const handleVerifyProduct = async (id: number) => {
        const payload = {
            "donation_item_id": id
        };

        await router.post('/donations/product/verify', payload, {
            onSuccess: () => {
                toast.success("Produk berhasil diverifikasi");
                router.reload({ only: ["data"] });
            }
        })
    }

    const handleFinishProduct = async (id: number) => {
        const payload = {
            "donation_item_id": id
        };

        await router.post('/donations/product/finish', payload, {
            onSuccess: () => {
                toast.success("Produk berhasil diterima");
                router.reload({ only: ["data"] });
            }
        })
    }

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        page: number
    ) => {
        router.get(
            route("donee.donations.donatedItem", {'donation': data.donation.id}),
            { page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <Authenticated>
            <div className="flex flex-col px-8 py-8 gap-4 w-full">
                <div>
                    <BackButton
                        startIcon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                            </svg>
                        }
                        LinkComponent="a"
                        href="/dashboard/donee"
                    >
                        Kembali
                    </BackButton>
                </div>
                <div className="flex flex-col px-4 gap-4 w-full">
                    <h2 className="text-primary-fg text-2xl font-bold self-start">
                        Daftar Sumbangan {data.donation.title}
                    </h2>
                    <TableContainer
                        component={Paper}
                        sx={{ padding: "0 1rem" }}
                    >
                        <Table>
                            <TableHead>
                                {data.donation.type ===
                                    "App\\Models\\ProductDonation" ? (
                                    <TableRow>
                                        <TableCell align="left">No</TableCell>
                                        <TableCell align="left">
                                            Tanggal
                                        </TableCell>
                                        <TableCell align="left">
                                            Kategori
                                        </TableCell>
                                        {productDonationHeader.map((value) => (
                                            <TableCell align="left" key={value}>
                                                {value}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            Aksi
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell align="left">No</TableCell>
                                        <TableCell align="left">
                                            Tanggal
                                        </TableCell>
                                        <TableCell align="left">
                                            Kategori
                                        </TableCell>
                                        {fundraisingHeader.map((value) => (
                                            <TableCell align="left" key={value}>
                                                {value}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            Aksi
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableHead>
                            <TableBody>
                                {data.donation.type ===
                                    "App\\Models\\ProductDonation" ? (
                                    <>
                                        {(data as ProductDonationData).donation_item.data.map((item, idx) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{paginatedProductData.current_page + idx}</TableCell>
                                                <TableCell>{formatDate(item.updated_at)}</TableCell>
                                                <TableCell>Produk</TableCell>
                                                <TableCell>{item.donor_donation.donor.username}</TableCell>
                                                <TableCell>{item.product_amount}</TableCell>
                                                <TableCell>
                                                    <ThemeProvider theme={theme}>
                                                        <Chip label={formatStatus(item.status)} color={item.status === "finished" ? "success" : "edit"}></Chip>
                                                    </ThemeProvider>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" flexDirection="row" gap={1}>
                                                        <Button variant="contained" sx={{ textTransform: "capitalize" }} size="small" onClick={() => { setPackagePicturePreview(item.package_picture) }}>Lihat Gambar</Button>
                                                        {item.status === "waiting_verification" ? (
                                                            <Button variant="contained" color="success" sx={{ textTransform: "capitalize" }} size="small" onClick={() => { handleVerifyProduct(item.id) }}>Verifikasi</Button>
                                                        ) : (item.status === "on_delivery" ? (
                                                            <Button variant="contained" color="warning" sx={{ textTransform: "capitalize" }} size="small" onClick={() => { handleFinishProduct(item.id) }}>Produk Diterima</Button>
                                                        ) : (
                                                            <></>
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell>
                                            Hello
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {/* Pagination */}
                        <Box
                            display="flex"
                            justifyContent="right"
                            py={2}
                            px={4}
                        >
                            <Pagination
                                count={paginatedProductData.last_page}
                                page={paginatedProductData.current_page}
                                onChange={handlePageChange}
                            ></Pagination>
                        </Box>
                    </TableContainer>
                </div>

                {packagePicturePreview.length > 0 && (
                    <div className="fixed z-50 backdrop-blur-md inset-0 bg-black bg-opacity-50 flex text-primary-bg items-center justify-center cursor-pointer" onClick={() => { setPackagePicturePreview("") }}>
                        <div className="bg-white w-2/5 h-fit rounded-xl flex flex-col p-4 gap-4 overflow-y-auto cursor-auto" onClick={(e) => { e.stopPropagation(); }}>
                            <h2 className="font-semibold justify-center items-center">Foto Paket</h2>
                            <img src={packagePicturePreview} alt="" className="object-contain h-full w-full rounded-md" />
                            <Button className="w-full" variant="contained" onClick={() => setPackagePicturePreview("")}>Tutup</Button>
                        </div>
                    </div>
                )}
            </div>
        </Authenticated>
    );
}
