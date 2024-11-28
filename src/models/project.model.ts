import mongoose from "mongoose";

export interface IProject {
  name: string;
  deadline: Date;
  description: string;
  status?: "active" | "inactive" | "completed";
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      required: true,
      unique: true,
      type: String,
    },
    deadline: {
      required: true,
      type: Date,
    },
    description: {
      required: true,
      type: String,
    },
    status: {
      default: "active",
      type: String,
      enum: ["active", "inactive", "completed"],
    }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema)