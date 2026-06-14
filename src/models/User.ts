import mongoose, { Schema, Document, model } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  likedBlogs: mongoose.Types.ObjectId[];
  otpCode?: number;
  otpExpires?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    likedBlogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        _id: false,
      },
    ],

    otpCode: {
      type: Number,
      required: false,
      default: null,
    },

    otpExpires: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || model<IUserDocument>("User", userSchema);

export default User;
