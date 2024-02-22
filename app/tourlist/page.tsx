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
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
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

interface TourForm {
  title: string,
  start_end: [dayjs.Dayjs, dayjs.Dayjs],
  recurrence: "daily" | "weekly",
  days?: string[]
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Page() {

  const [tours, setTours] = useState<Tour[]>([]);
  const [open, setOpen] = React.useState(false);
  const [tour, setTour] = useState<Tour | null>(null);
  const [isOpen2, setIsOpen2] = useState(false);

  const { control, register, reset, handleSubmit, formState } = useForm<TourForm>({
    defaultValues: {
      title: "",
      start_end: [dayjs('2022-04-17'), dayjs('2022-04-21')],
      recurrence: "daily",
      days: []
    },
  })

  useEffect(() => {
    fetch('/api/tour')
      .then(response => response.json())
      .then(data => {
        setTours(data.tours)
      })
  }, [])


  if (tours.length === 0) return (
    <div className='text-center h-full'>No tours available</div>
  )

  const handleOpen = (row: Tour) => {
    setTour(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setIsOpen2(true);
  };

  const handleClose2 = () => {
    setIsOpen2(false);
  };

  const handleBooking = async (data: TourForm) => {
    try {
      const response = await fetch("http://localhost:3000/api/tour/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, title: tour?.title, tourid: tour?._id }),
      });

      const res = await response.json();
      handleOpen2();
      if (res.message === "redirect")
        handleClose();
    } catch (error) {
      // any logging service and handle error message
      console.error(error);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>
                <TableCell align="center">Recurrence type</TableCell>
                <TableCell align="center">Days</TableCell>
                <TableCell align="center">Book</TableCell>
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
                  <TableCell align="center">{new Date(row.start_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{new Date(row.end_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{row.recurrence}</TableCell>
                  <TableCell align="center">{row.days.length && row.days.map((day, index) => {
                    if (index === row.days.length - 1) return `${day}`;
                    return `${day} , `;
                  }) || "All week days"}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => handleOpen(row)}>Book</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: "fit-content" }}>
            <Typography variant="h2" gutterBottom className='text-center'>
              {tour && tour.title} booking form
            </Typography>
            <div className='flex flex-row gap-x-4'>
              {tour && tour?.recurrence === "daily" && (
                <Controller
                  name="start_end"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={dayjs(tour.start_date)}
                      maxDate={dayjs(tour.end_date)}
                    />
                  )}
                />
              )}
              {tour && tour?.recurrence === "weekly" && (
                <Controller
                  name="start_end"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      minDate={dayjs(tour.start_date)}
                      shouldDisableDate={(date) => {
                        return !tour.days.includes(date.format('dddd').toLowerCase())
                      }}
                    />
                  )} />
              )}
            </div>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleSubmit(handleBooking)}>Book</Button>
          </Box>
        </Modal>
        <Modal
          open={isOpen2}
          onClose={handleClose2}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: "fit-content" }}>
            <Typography variant="h2" gutterBottom className='text-center'>
              Booking Successful
            </Typography>
            <Button onClick={handleClose2}>Close</Button>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  )
}