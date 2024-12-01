import mongoose from "mongoose";

export interface IProject {
  _id?: mongoose.Types.ObjectId;
  name: string;
  deadline: Date;
  description: string;
  status?: "active" | "inactive" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
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