"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";

export interface Form {
  title: string,
  start_date: string,
  end_date: string,
  recurrence: "daily" | "weekly",
  days?: string[]
}

export default function Home() {

  const router = useRouter();

  const { register, control, handleSubmit, reset, formState, watch } = useForm<Form>({
    defaultValues: {
      title: "",
      start_date: "",
      end_date: "",
      recurrence: "daily",
      days: ['']
    },
  })

  const recurrence = watch("recurrence");

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const response = await fetch(`${process.env.VERCEL_URL}/api/tour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.message === "redirect")
        router.push("/tourlist");
    } catch (error) {
      // any logging service and handle error message
      console.error(error);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className="flex min-h-screen flex-col items-center p-24">
        <Typography variant="h1" gutterBottom>
          Tour Creation Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit, () => { console.log("invalid") })}>
          <div className="flex flex-row items-center gap-x-5">
            <TextField id="outlined-basic" label="Title" variant="outlined" required {...register("title")} />
            {formState.errors.title && <span>This field is required</span>}
            <Controller
              name="start_date"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {formState.errors.start_date && <p className="text-red-400">{formState.errors.start_date.message}</p>}
            <Controller
              name="end_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="End Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {formState.errors.end_date && <p className="text-red-400">{formState.errors.end_date.message}</p>}
          </div>
          <div className="flex flex-col justify-center items-start gap-y-5">
            <Controller
              name="recurrence"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (<>
                <InputLabel id="age">Recurrence</InputLabel>
                <Select
                  labelId="age"
                  id="demo-simple-select"
                  value={field.value}
                  label="Recurrence"
                  onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
                >
                  <MenuItem value={"daily"}>Daily</MenuItem>
                  <MenuItem value={"weekly"}>Weekly</MenuItem>
                </Select>
              </>
              )}
            />
            {recurrence === "weekly" && (<>
              <InputLabel id="age">Days</InputLabel>
              <Controller
                name="days"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    multiple
                    labelId="Week Days"
                    id="demo-simple-select"
                    // @ts-ignore
                    value={field.value}
                    label="Days"
                    onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
                  >
                    <MenuItem value={"monday"}>Monday</MenuItem>
                    <MenuItem value={"tuesday"}>Tuesday</MenuItem>
                    <MenuItem value={"wednesday"}>Wednesday</MenuItem>
                    <MenuItem value={"thursday"}>Thursday</MenuItem>
                    <MenuItem value={"friday"}>Friday</MenuItem>
                    <MenuItem value={"saturday"}>Saturday</MenuItem>
                    <MenuItem value={"sunday"}>Sunday</MenuItem>
                  </Select>
                )}
              />
            </>
            )}
            <Button variant="contained" type="submit" style={{ display: "block" }}>Submit</Button>
          </div>
        </form>
      </main >
    </LocalizationProvider>
  );
}
