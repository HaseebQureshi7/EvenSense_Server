import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const TEST_URL = process.env.MONGO_URL_TEST

export const connectToTestDb = async (): Promise<void> => {
    try {
        await mongoose.connect(TEST_URL);
        console.log("Test Database Connected");
    } catch (err) {
        console.error("DB Not Connected !!!", err);
    }
}

export const disconnectFromTestDb = async (): Promise<void> => {
    await mongoose.disconnect()
}