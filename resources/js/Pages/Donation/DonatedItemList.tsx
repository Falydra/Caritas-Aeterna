import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import {
    Button,
    capitalize,
    Chip,
    createTheme,
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

interface BookPivot {
    book_donation_id: number;
    donation_item_id: number;
    amount: number;
    updated_at: string;
}

interface DonationItem {
    id: number;
    donor_donation_id: number;
    product_amount: number;
    package_picture: string;
    status: string;
    pivot: BookPivot;
    donor_donation: DonorDonation;
}

interface Book {
    isbn: string;
    title: string;
    authors: string[];
    published_year: string;
}

interface BookDonation {
    id: number;
    donation_id: number;
    isbn: string;
    amount: number;
    fulfilled_amount: number;
    status: string;
    book: Book;
    donation_item: DonationItem[];
}

interface Facility {
    id: number;
    product_donation_id: number;
    name: string;
    description: string;
    dimension: string;
    material: string;
    price: string;
    status: string;
    updated_at: string;
    donation_item: DonationItem[];
}

interface ProductData {
    donation: Donation;
    books: BookDonation[];
    facilities: Facility[];
}

interface FundraiserData {
    donation: Donation;
}

interface DonatedItemProps extends PageProps {
    auth: {
        user: User;
        roles: string;
    };
    data: ProductData | FundraiserData;
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

    const handleBack = () => {
        Inertia.visit("/dashboard/donee");
    };

    const productDonationHeader = [
        "Nama Donatur",
        "Nama Produk",
        "Jumlah",
        "Status",
    ];
    const fundraisingHeader = ["Nama Donatur", "Jumlah", "Status"];

    console.log("Item Data", data);

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
                                        {/* <TableCell align="left">No</TableCell> */}
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
                                        <TableRow>
                                            <TableCell colSpan={10}>
                                                <Typography fontWeight="bold">
                                                    Daftar Sumbangan Buku
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {(data as ProductData).books.map(
                                            (book) => (
                                                (book.donation_item.map((item) => {
                                                    return <TableRow key={item.id}>
                                                        <TableCell align="left">
                                                            {formatDate(item.pivot.updated_at)}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            Produk
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {item.donor_donation.donor.username}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {book.book.title}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {item.pivot.amount}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <ThemeProvider theme={theme}>
                                                                <Chip
                                                                    label={formatStatus(
                                                                        item.status
                                                                    )}
                                                                    sx={{
                                                                        textTransform:
                                                                            "capitalize",
                                                                    }}
                                                                    color={
                                                                        item.status ===
                                                                            "finished"
                                                                            ? "success"
                                                                            : "edit"
                                                                    }
                                                                ></Chip>
                                                            </ThemeProvider>
                                                        </TableCell>
                                                    </TableRow>
                                                }))
                                            )
                                        )}
                                        <TableRow>
                                            <TableCell colSpan={10}>
                                                <Typography fontWeight="bold">
                                                    Daftar Sumbangan Fasilitas
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {(data as ProductData).facilities.map(
                                            (facility) => (
                                                (facility.donation_item.map((item) => {
                                                    return <TableRow key={item.id}>
                                                        <TableCell align="left">
                                                            {formatDate(item.pivot.updated_at)}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            Produk
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {item.donor_donation.donor.username}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {facility.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {item.pivot.amount}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <ThemeProvider theme={theme}>
                                                                <Chip
                                                                    label={formatStatus(
                                                                        item.status
                                                                    )}
                                                                    sx={{
                                                                        textTransform:
                                                                            "capitalize",
                                                                    }}
                                                                    color={
                                                                        item.status ===
                                                                            "finished"
                                                                            ? "success"
                                                                            : "edit"
                                                                    }
                                                                ></Chip>
                                                            </ThemeProvider>
                                                        </TableCell>
                                                    </TableRow>
                                                }))
                                            )
                                        )}
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
                    </TableContainer>
                </div>
            </div>
        </Authenticated>
    );
}
