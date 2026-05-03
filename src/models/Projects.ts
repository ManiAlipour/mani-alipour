import mongoose, { Schema, Document, model } from "mongoose";

export type ProjectStatus = "planned" | "in-progress" | "done" | "archived";

export interface IProjectDocument extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured: boolean;
  order?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["planned", "in-progress", "done", "archived"],
      default: "done",
      index: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    demoUrl: {
      type: String,
      trim: true,
    },

    coverImage: {
      type: String,
      trim: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Project =
  mongoose.models.Project || model<IProjectDocument>("Project", projectSchema);

export default Project;
