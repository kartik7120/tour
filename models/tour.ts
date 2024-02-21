import mongoose from "mongoose";

interface Tour extends mongoose.Document {
    title: string;
    start_date: string;
    end_date: string;
    recurrence: "daily" | "weekly";
    days?: string[];
}

const TourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    recurrence: {
        type: String,
        required: true
    },
    days: {
        type: [String],
        required: false
    }
});

export default mongoose.models.Tour || mongoose.model<Tour>("Tour", TourSchema);