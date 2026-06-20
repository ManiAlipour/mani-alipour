import mongoose, { Schema, model, models } from "mongoose";

const likeSchema = new Schema(
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
      default: null,
      index: true,
    },

    visitorId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// جلوگیری از لایک تکراری برای کاربران لاگین‌شده
likeSchema.index(
  { postId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      userId: { $type: "objectId" },
    },
  },
);

// جلوگیری از لایک تکراری برای کاربران مهمان
likeSchema.index(
  { postId: 1, visitorId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      visitorId: { $type: "string" },
    },
  },
);

const Like = models.Like || model("Like", likeSchema);

export default Like;
