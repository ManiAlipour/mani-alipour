import mongoose, { Schema, Document, model } from "mongoose";

export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface IContactDocument extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContactDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    subject: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

const Contact =
  mongoose.models.Contact || model<IContactDocument>("Contact", contactSchema);

export default Contact;
