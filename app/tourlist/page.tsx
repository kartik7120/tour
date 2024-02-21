"use client";
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface Tour {
  title: string;
  start_date: Date;
  end_date: Date;
  recurrence: String;
  days: string[];
}

export default function Page() {

  const [tours, setTour] = useState<Tour[]>([])

  useEffect(() => {
    fetch('/api/tour')
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setTour(data.tours)
      })
  }, [])

  if (tours.length === 0) return (
    <div className='text-center h-full'>No tours available</div>
  )

  return (
    <div className='m-4'>
      <Typography variant="h1" gutterBottom className='text-center'>
        Tour Listing
      </Typography>
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
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Recurrence type</TableCell>
              <TableCell align="right">Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((row) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="right">{typeof row.start_date}</TableCell>
                <TableCell align="right">{typeof row.end_date}</TableCell>
                <TableCell align="right">{row.recurrence}</TableCell>
                <TableCell align="right">{row.days.length && row.days.map((day, index) => {
                  if (index === row.days.length - 1) return `${day}`;
                  return `${day} , `;
                }) || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
