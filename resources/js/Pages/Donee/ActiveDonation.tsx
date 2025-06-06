import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, PageProps, User } from "@/types";
import { amber, grey } from "@mui/material/colors";
import { Box, Button, Chip, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Inertia } from "@inertiajs/inertia";

declare module '@mui/material/styles' {
    interface Palette {
        edit: Palette['primary'];
    }

    interface PaletteOptions {
        edit?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        edit: true;
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
    },
});

interface PaginatedDonations {
    data: Donation[];
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

interface activeDonationProps extends PageProps {
    auth: {
        user: User;
        roles: string;
    },
    data: PaginatedDonations;
}

function formatClassName(className: string): string {
    const parts = className.split('\\');
    const modelName = parts[parts.length - 1];

    // Insert a space before capital letters and trim
    return modelName.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
}

export default function DoneeActiveDonation() {
    const [activePage, setActivePage] = useState<string>("Donasi Dibuka")

    const handleChangePage = (title: string) => {
        setActivePage(title);
    }

    const { auth, data } = usePage<activeDonationProps>().props;

    const rows = data.data;

    const onDetailClick = (donationId: number) => {
        Inertia.visit(`/donations/${donationId}`);
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        Inertia.visit(`?page=${page}`);
    };

    return (
        <Authenticated>
            <div className="flex flex-col px-12 py-8 gap-4 w-full">
                <h2 className="text-primary-fg text-2xl font-bold self-start">
                    Donasi Dibuka
                </h2>
                <ThemeProvider theme={theme}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">No</TableCell>
                                    <TableCell align="left">Judul</TableCell>
                                    <TableCell align="left">Jenis</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {index + data.current_page}
                                        </TableCell>
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell>{formatClassName(row.type)}</TableCell>
                                        <TableCell align="center">
                                            <Chip label={row.status} sx={{ textTransform: "capitalize" }} color={
                                                row.status === "finished" ? "success" : "edit"
                                            }></Chip>
                                        </TableCell>
                                        <TableCell align="center" >
                                            <Box display="flex" gap={2} justifyContent="center">
                                                <Button variant="contained" size="small" color="info" sx={{ textTransform: 'capitalize' }} component="a" target="_blank" href={`/donations/${row.id}`}>detail</Button>
                                                <Button variant="contained" size="small" color="edit" sx={{ textTransform: 'capitalize' }} component="a" target="_blank" >edit</Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <Box display="flex" justifyContent="right" py={2} px={4}>
                            <Pagination count={data.last_page} page={data.current_page} onChange={handlePageChange}></Pagination>
                        </Box>
                    </TableContainer>
                </ThemeProvider>
            </div>
        </Authenticated>
    );
}
