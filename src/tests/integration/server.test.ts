import supertest, { Response } from "supertest";
import app from "../../app";

describe("General Server Tests", () => {
    it("Should return a 200 status with a health message", async () => {
        const res:Response = await supertest(app).get("/ping")
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("message")
        expect(res.body.message).toBe("Server is up and running 🎉")
    })
})