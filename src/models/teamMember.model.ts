import mongoose from "mongoose";

export interface ITeamMember {
  _id?: mongoose.Types.ObjectId,
  name: string;
  role:
    | "designer"
    | "front-end"
    | "back-end"
    | "dev-ops"
    | "project-lead"
    | "other";
  ofProject: mongoose.Types.ObjectId;
}

const teamMemberSchema = new mongoose.Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "designer",
        "front-end",
        "back-end",
        "dev-ops",
        "project-lead",
        "other",
      ],
    },
    ofProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TeamMember = mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);
