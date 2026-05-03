import mongoose, { Schema, model, Document } from "mongoose";

export interface IBlogDocument extends Document {
  slug: string;
  title: string;
  content: string;
  readAt: number;
  createdAt: Date;
  updatedAt: Date;
  cover: string;
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  tags: mongoose.Types.ObjectId[];
  excerpt: string;
}

const blogSchema = new Schema<IBlogDocument>(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    readAt: {
      type: Number,
      default: 1,
    },

    cover: {
      type: String,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
      required: true,
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.models.Blog || model<IBlogDocument>("Blog", blogSchema);

export default Blog;
