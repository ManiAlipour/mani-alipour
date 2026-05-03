import mongoose, { Schema, Document, model } from "mongoose";

export interface ILikeDocument extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<ILikeDocument>({
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
});

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.models.Like || model<ILikeDocument>("Like", likeSchema);

export default Like;
