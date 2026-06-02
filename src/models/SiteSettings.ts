import mongoose, { Schema, Document, model } from "mongoose";

export const SETTINGS_KEY = "global";

export interface ISiteSettingsDocument extends Document {
  key: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowComments: boolean;
  allowRegistration: boolean;
  postsPerPage: number;
  notifyNewContact: boolean;
  notifyNewComment: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    key: {
      type: String,
      default: SETTINGS_KEY,
      unique: true,
      immutable: true,
    },
    siteName: {
      type: String,
      default: "مانی علی‌پور",
      trim: true,
    },
    siteDescription: {
      type: String,
      default: "وبلاگ و پورتفولیو شخصی",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    maintenanceMode: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    allowRegistration: { type: Boolean, default: true },
    postsPerPage: { type: Number, default: 10, min: 5, max: 50 },
    notifyNewContact: { type: Boolean, default: true },
    notifyNewComment: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  model<ISiteSettingsDocument>("SiteSettings", siteSettingsSchema);

export default SiteSettings;
