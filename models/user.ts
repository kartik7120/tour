import mongoose from "mongoose";

interface User {
    name: string;
    bookings: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>({
    bookings: {
        type: [mongoose.Types.ObjectId],
        required: true,
    },
});

export default mongoose.models.User || mongoose.model<User>("User", userSchema);