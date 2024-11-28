import mongoose from "mongoose";

export interface IArchitecture {
  name: string;
  description: string;
  ofProject: mongoose.Types.ObjectId;
}

const ArchitectureSchema = new mongoose.Schema<IArchitecture>(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    ofProject: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Architecture = mongoose.model<IArchitecture>(
  "Architecture",
  ArchitectureSchema
);
