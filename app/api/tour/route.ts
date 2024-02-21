import dbConnect from "@/db/dbConnect";
import Tour from "@/models/tour";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
    try {
        const body = await req.json();
        await dbConnect();
        const tour = new Tour({
            title: body.title,
            start_date: body.start_date,
            end_date: body.end_date,
            recurrence: body.recurrence,
            days: body.days
        });
        await tour.save();
        return NextResponse.json({ message: "redirect" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    console.log("Hello from tour path");

    try {
        await dbConnect();

        const tours = await Tour.find({}).sort({ createdAt: "desc" }).limit(20);
        return NextResponse.json({ tours });

    } catch (error) {
        console.log(error);
        NextResponse.json({ message: "Something went wrong" });
    }

    return NextResponse.json({ message: "Hello from tour path" });
}