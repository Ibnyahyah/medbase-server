import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        recordId: {
            type: String
        },
        contents: {
            type: String
        },
        file: {
            type: String
        },
        role: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
