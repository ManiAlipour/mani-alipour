import mongoose, { Schema, model, Document } from "mongoose";

export interface ITagDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  postCount: number;
}

const tagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    postCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.models.Tag || model<ITagDocument>("Tag", tagSchema);

export default Tag;
