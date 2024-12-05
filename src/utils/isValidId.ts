import mongoose from "mongoose"

type isValidIDType = mongoose.Types.ObjectId | string;

export const isValidID = (id: isValidIDType) => {
    return mongoose.Types.ObjectId.isValid(id)
}