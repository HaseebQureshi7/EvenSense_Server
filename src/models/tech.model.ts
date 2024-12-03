import mongoose from "mongoose";

export interface ITech {
  _id?: mongoose.Types.ObjectId,
  name: string;
  usedFor: "design" | "development" | "testing" | "deployment" | "other";
  ofProject: mongoose.Types.ObjectId;
}

const TechSchema = new mongoose.Schema<ITech>(
  {
    name: {
      type: String,
      required: true,
    },
    usedFor: {
      type: String,
      required: true,
      enum: ["design", "development", "testing", "deployment", "other"],
    },
    ofProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

export const Tech = mongoose.model<ITech>("Tech", TechSchema);
