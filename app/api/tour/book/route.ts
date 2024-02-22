import dbConnect from "@/db/dbConnect";
import Tour from "@/models/tour";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        await dbConnect();
        const tourid = body.tourid;
        
        const tour = await Tour.findById(tourid);
        if (!tour) {
            return NextResponse.json({ message: "Tour not found" });
        }

        const user = new User({
            bookings: [tourid],
        });

        await user.save();

        return NextResponse.json({ message: "redirect" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await dbConnect();
        const bookings = await User.find({}).sort({ createdAt: "desc" }).limit(20);

        const tours = await Tour.find({ _id: { $in: bookings.map((booking) => booking.bookings) } });

        return NextResponse.json({ tours });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" });
    }
}