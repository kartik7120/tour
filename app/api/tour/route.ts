import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    // const title = searchParams.get("title");
    // const start_date = searchParams.get("start_date");
    // const end_date = searchParams.get("end_date");
    // const recurrence = searchParams.get("recurrence");
    // const days = searchParams.getAll("days");
    // console.log(title, start_date, end_date, recurrence, days);
    console.log(req.body)
    console.log("Hello from tour path")
    //   const response = await fetch("http://localhost:3000/api/tour", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ title, start_date, end_date, recurrence, days }),
    //   });
    //   const data = await response.json();
    //   console.log(data);
    const url = new URL(req.url);
    return NextResponse.json({ message: "redirect" });
}