import mongoose, { Schema, model, Document } from "mongoose";

export interface ICommentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;

  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Comment =
  mongoose.models.Comment || model<ICommentDocument>("Comment", commentSchema);

export default Comment;
