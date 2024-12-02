import mongoose from "mongoose";
import app from "../../app";

describe("Architecture Tests", () => {
    const baseURL = "api/v1/" 

    // Initial Connection
    beforeAll(async () => {
        const TEST_DB_URI = process.env.MONGO_URL_TEST;
        await mongoose
          .connect(TEST_DB_URI)
          .then(() => {
            console.log("Test Database Connected");
          })
          .catch((err) => {
            console.log("DB Not Connected !!! ", err);
          });
      });
    afterAll(async () => {
        await mongoose.disconnect();
    })

    describe('Create Archtecture', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if no body is provided", () => {})
            it("Should return 400 if required fields are missing", () => {})
        })
        describe('Success Tests', () => {
            it("Should return 201 for valid project data", () => {})
        })
    })

    describe('Delete Archtecture', () => {
        describe('Validation Tests', () => {})
        describe('Success Tests', () => {})
    })

    describe('View Archtecture', () => {
        describe('Validation Tests', () => {})
        describe('Success Tests', () => {})
    })

    describe('Update Archtecture', () => {
        describe('Validation Tests', () => {})
        describe('Success Tests', () => {})
    })
})