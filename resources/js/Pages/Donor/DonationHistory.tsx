import { useState, useEffect } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Box,
    Button,
    ButtonGroup,
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
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import { Inertia } from "@inertiajs/inertia";

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

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        edit: true;
        light: true;
    }
}

declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        edit: true;
        light: true;
    }
}

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
    color: "#ddd7e4",
    border: "1px solid #ddd7e4",
    "&.Mui-selected": {
        backgroundColor: "#ddd7e4",
        color: theme.palette.grey[900],
        border: "1px solid #ddd7e4",
        "&:hover": {
            backgroundColor: "#ddd7e4",
        },
    },
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
}));

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
    title: string;
}

interface DonorDonation {
    id: number;
    donation_id: number;
    donation: Donation;
}

interface Fund {
    id: number;
    donor_donation_id: number;
    type: string;
    amount: number;
    status: string;
    redirect_url: string;
    created_at: string;
    donor_donation: DonorDonation;
}

interface Item {
    id: number;
    donor_donation_id: number;
    type: string;
    product_amount: number;
    status: string;
    created_at: string;
    donor_donation: DonorDonation;
}

type DonationEntry = Fund | Item;

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
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

async function fetchAllDonationHistory(
    page = 1
): Promise<PaginatedResponse<DonationEntry>> {
    const response = await fetch(`/donation-history/all?page=${page}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function fetchFundDonationHistory(
    page = 1
): Promise<PaginatedResponse<DonationEntry>> {
    const response = await fetch(`/donation-history/funds?page=${page}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function fetchProductDonationHistory(
    page = 1
): Promise<PaginatedResponse<DonationEntry>> {
    const response = await fetch(`/donation-history/items?page=${page}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export default function DonationHistory() {
    const [category, setCategory] = useState<string>("all");
    const [donations, setDonations] = useState<DonationEntry[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [paginatedData, setPaginatedData] =
        useState<PaginatedResponse<DonationEntry> | null>(null);

    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

    useEffect(() => {
        setLoading(true);

        if (category === "all") {
            fetchAllDonationHistory(page)
                .then((res) => {
                    setDonations(res.data);
                    setLastPage(res.last_page);
                    setPaginatedData(res);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        } else if (category === "funds") {
            fetchFundDonationHistory(page)
                .then((res) => {
                    setDonations(res.data);
                    setLastPage(res.last_page);
                    setPaginatedData(res);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        } else if (category === "items") {
            fetchProductDonationHistory(page)
                .then((res) => {
                    setDonations(res.data);
                    setLastPage(res.last_page);
                    setPaginatedData(res);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [category, page]);

    const handleCategoryChange = (
        event: React.MouseEvent<HTMLElement>,
        newCategory: string
    ) => {
        if (newCategory !== null) {
            setCategory(newCategory);
            setPaginatedData(null);
        }
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    return (
        <Authenticated>
            <div className="flex flex-col px-12 py-8 gap-4 w-full">
                <h2 className="text-primary-fg text-2xl font-bold self-start">
                    Riwayat Donasi
                </h2>
                <ThemeProvider theme={theme}>
                    <Box display="flex" flexDirection="column" gap={4} py={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <p>Kategori</p>
                            <ToggleButtonGroup
                                exclusive
                                value={category}
                                aria-label="category"
                                size="small"
                                onChange={handleCategoryChange}
                            >
                                <CustomToggleButton value="all">
                                    Semua
                                </CustomToggleButton>
                                <CustomToggleButton value="funds">
                                    Dana
                                </CustomToggleButton>
                                <CustomToggleButton value="items">
                                    Produk
                                </CustomToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <TableContainer
                            component={Paper}
                            sx={{ padding: "0 1rem" }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">No</TableCell>
                                        <TableCell align="left">
                                            Tanggal
                                        </TableCell>
                                        <TableCell align="left">
                                            Kategori
                                        </TableCell>
                                        <TableCell align="left">
                                            Judul
                                        </TableCell>
                                        <TableCell align="left">
                                            Jumlah
                                        </TableCell>
                                        <TableCell align="left">
                                            Status
                                        </TableCell>
                                        <TableCell align="center">
                                            Aksi
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                align="center"
                                            >
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        paginatedData ? (
                                            donations.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {index +
                                                            paginatedData.current_page}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(row.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.type}
                                                    </TableCell>
                                                    <TableCell className="font-bold">
                                                        {
                                                            row.donor_donation
                                                                .donation.title
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.type === "Funds"
                                                            ? `${formatter.format(
                                                                (row as Fund)
                                                                    .amount
                                                            )}`
                                                            : `${(row as Item)
                                                                .product_amount
                                                            } Produk`}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Chip
                                                            label={formatStatus(
                                                                row.status
                                                            )}
                                                            sx={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                            color={
                                                                row.status ===
                                                                    "finished"
                                                                    ? "success"
                                                                    : "edit"
                                                            }
                                                        ></Chip>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                            component="a"
                                                            target="_blank"
                                                            href={
                                                                row.type === "Funds"
                                                                    ? (row as Fund)
                                                                        .redirect_url
                                                                    : ""
                                                            }
                                                        >
                                                            Detail
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    align="center"
                                                >
                                                    Riwayat Donasi Kosong
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                            {/* Pagination */}
                            {paginatedData && (
                                <Box display="flex" justifyContent="right" py={2} px={4}>
                                    <Pagination count={paginatedData.last_page} page={paginatedData.current_page} onChange={handlePageChange}></Pagination>
                                </Box>
                            )}
                        </TableContainer>
                    </Box>
                </ThemeProvider>
            </div>
        </Authenticated>
    );
}
