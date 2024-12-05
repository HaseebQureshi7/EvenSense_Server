import mongoose from "mongoose";

export type linkTypes = "doc" | "deploy" | "dev"

export interface ILink {
  _id?: mongoose.Types.ObjectId,
  name: string;
  url: string;
  type: linkTypes;
  ofProject: mongoose.Types.ObjectId;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["doc", "deploy", "dev"],
    },
    ofProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model<ILink>("Link", LinkSchema);
