import mongoose from "mongoose";
import app from "../../app";
import supertest from "supertest";
import { IArchitecture } from "../../models/architecture.model";
import { connectToTestDb, disconnectFromTestDb } from "../helpers/testDbConfig";
import { baseURL } from "../utils/config";

// HELPER FUNCTIONS
export async function createTestArchitecture(app: any): Promise<IArchitecture> {
    const testArchitectureBody: IArchitecture = {
        name: "Test Architecture",
        description: "Lorem Ipsum Dolor Sit",
        ofProject: new mongoose.Types.ObjectId()
    };

    const response = await supertest(app).post(`${baseURL}/architecture`).send(testArchitectureBody);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(testArchitectureBody.name);

    return response.body; // Return the created architecture for further use
}

export async function deleteTestArchitecture(app: any, architectureId: mongoose.Types.ObjectId): Promise<void> {
    const response = await supertest(app).delete(`${baseURL}/architecture/${architectureId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Architecture deleted successfully");
}

describe("Architecture Tests", () => {

    beforeAll(async () => {
        await connectToTestDb()
    })

    afterAll(async () => {
        await disconnectFromTestDb()
    })


    describe('Create Archtecture', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if no body is provided", async () => {
                const response = await supertest(app).post(baseURL + "architecture").send()
                expect(response.status).toBe(400)
                expect(response.body.message).toBe("No body provided")
            })
            it("Should return 400 if required fields are missing", async () => {
                const testArchitectureBody: Partial<IArchitecture> = {
                    name: "Test Architecture",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
                const response = await supertest(app).post(baseURL + "architecture").send(testArchitectureBody)
                expect(response.status).toBe(400)
                expect(response.body.message).toBe("Missing required fields")
            })
        })
        describe('Success Tests', () => {
            let testArchitecture: IArchitecture;
            afterAll(async () => {
                const response = await supertest(app).delete(baseURL + "architecture/" + testArchitecture?._id);
                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Architecture deleted successfully");
            })
            it("Should return 201 for valid project data", async () => {
                const testArchitectureBody: IArchitecture = {
                    name: "Test Architecture",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    ofProject: new mongoose.Types.ObjectId()
                }
                const response = await supertest(app).post(baseURL + "architecture").send(testArchitectureBody)
                expect(response.status).toBe(201)
                expect(response.body.name).toBe(testArchitectureBody.name)
                testArchitecture = response.body
            })
        })
    })

    describe('Delete Archtecture', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid id is provided", async () => {
                const invalidId = "invalid-id"; // Not a valid MongoDB ObjectId
                const response = await supertest(app).delete(`${baseURL}/architecture/${invalidId}`);
                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Invalid architecture ID");
            });

            it("Should return 404 if a non-existing id is provided", async () => {
                const nonExistingId = new mongoose.Types.ObjectId(); // Valid ObjectId but not in the database
                const response = await supertest(app).delete(`${baseURL}/architecture/${nonExistingId}`);
                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Architecture not found");
            });
        });
        describe('Success Tests', () => {
            let testArchitecture: IArchitecture;
            beforeEach(async () => {
                const testArchitectureBody: IArchitecture = {
                    name: "Test Architecture",
                    description: "Lorem Ipsum Dolor Sit",
                    ofProject: new mongoose.Types.ObjectId()
                }
                const createdArchitecture = await supertest(app).post(baseURL + "architecture").send(testArchitectureBody)
                expect(createdArchitecture.status).toBe(201)
                expect(createdArchitecture.body.name).toBe(testArchitectureBody.name)
                testArchitecture = createdArchitecture.body
            })

            it("Should return 200 if a valid id is provided", async () => {
                const response = await supertest(app).delete(baseURL + "architecture/" + testArchitecture?._id);
                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Architecture deleted successfully");
            })
        })
    })

    describe('View All Archtectures', () => {
        // No Validation tests for this Controller

        describe('Success Tests', () => {
            let testArchitecture: IArchitecture;

            beforeEach(async () => {
                testArchitecture = await createTestArchitecture(app);
            });

            afterEach(async () => {
                if (testArchitecture?._id) {
                    await deleteTestArchitecture(app, testArchitecture?._id);
                }
            });

            it("Should return 200 and all the architectures", async () => {
                const response = await supertest(app).get(baseURL + "architecture");
                expect(response.body.length).toBeGreaterThan(0)
                expect(response.body[0].name).toBe(testArchitecture.name)
            })
        })
    })

    describe('View Project Archtecture', () => {
        const validOID = new mongoose.Types.ObjectId()
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid project id is provided", async () => {
                const response = await supertest(app).get(baseURL + "architecture/get_project_architecture/" + "invalid-oid")
                expect(response.status).toBe(400)
                expect(response.body.message).toBe("Invalid project ID")
            })
            it("Should return 404 if a non-existing project id is provided", async () => {
                const response = await supertest(app).get(baseURL + "architecture/get_project_architecture/" + validOID)
                expect(response.status).toBe(404)
                expect(response.body.message).toBe("Architecture not found for this project")
            })
        })
        describe('Success Tests', () => {
            let testArchitecture: IArchitecture;
            beforeEach(async () => {
                testArchitecture = await createTestArchitecture(app);
            })
            afterAll(async () => {
                if (testArchitecture?._id) {
                    await deleteTestArchitecture(app, testArchitecture?._id);
                }
            })

            it("Should return 200 and the related data if a valid id is provided", async () => {
                const response = await supertest(app).get(baseURL + "architecture/get_project_architecture/" + testArchitecture?.ofProject)
                expect(response.status).toBe(200)
                expect(response.body.name).toBe(testArchitecture.name)
            })
        })
    })

    describe('Update Archtecture', () => {
        const validOID = new mongoose.Types.ObjectId()
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid id is provided", async () => {
                const response = await supertest(app).patch(baseURL + "architecture/" + "invalid-oid").send()
                expect(response.status).toBe(400)
                expect(response.body.message).toBe("Invalid architecture ID")
            })

            it("Should return 404 if a non-existing id is provided", async () => {
                const response = await supertest(app).patch(baseURL + "architecture/" + validOID).send()
                expect(response.status).toBe(404)
                expect(response.body.message).toBe("Architecture not found")
            })
        })
        describe('Success Tests', () => {
            let testArchitecture: IArchitecture;
            beforeAll(async () => {
                testArchitecture = await createTestArchitecture(app);
            })
            afterAll(async () => {
                if (testArchitecture?._id) {
                    await deleteTestArchitecture(app, testArchitecture?._id);
                }
            })

            it("Should return 200 and the updated data if a valid id is provided", async () => {
                const updatedArchBody: Partial<IArchitecture> = {
                    name: "Updated Architecture",
                    description: "Updated Description",
                }
                const response = await supertest(app).patch(baseURL + "architecture/" + testArchitecture?._id).send(updatedArchBody)
                expect(response.status).toBe(200)
                expect(response.body.name).toBe(updatedArchBody.name)
                expect(response.body.description).toBe(updatedArchBody.description)
            })
        })
    })
})