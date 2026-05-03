import mongoose, { Schema, Document, model } from "mongoose";

export interface IViewDocument extends Document {
  postId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  ip?: string;
  createdAt: Date;
}

const viewSchema = new Schema<IViewDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    ip: {
      type: String,
    },
  },
  { timestamps: true },
);

viewSchema.index({ userId: 1, postId: 1 });
viewSchema.index({ ip: 1, postId: 1 });


const View = mongoose.models.View || model<IViewDocument>("View", viewSchema);

export default View;
