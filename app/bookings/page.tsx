"use client";
import { useEffect, useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface Tour {
    _id: string;
    title: string;
    start_date: Date;
    end_date: Date;
    recurrence: String;
    days: string[];
}

export default function Page() {

    const [bookings, setBookings] = useState<Tour[]>([]);

    useEffect(() => {
        fetch('/api/tour/book')
            .then(response => response.json())
            .then(data => {
                setBookings(data.tours)
            })
    }, [])

    return (
        <TableContainer component={Paper} style={{
            marginTop: "20px",
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto"
        }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="center">Start Date</TableCell>
                        <TableCell align="center">End Date</TableCell>
                        <TableCell align="center">Recurrence type</TableCell>
                        <TableCell align="center">Days</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings.map((row: Tour) => (
                        <TableRow
                            key={row.title}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="center">{new Date(row.start_date).toLocaleDateString()}</TableCell>
                            <TableCell align="center">{new Date(row.end_date).toLocaleDateString()}</TableCell>
                            <TableCell align="center">{row.recurrence}</TableCell>
                            <TableCell align="center">{row.days.length && row.days.map((day, index) => {
                                if (index === row.days.length - 1) return `${day}`;
                                return `${day} , `;
                            }) || "All week days"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
