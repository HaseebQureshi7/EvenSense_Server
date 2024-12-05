import mongoose from "mongoose"
import app from './../../app';
import supertest from "supertest";
import { ITeamMember } from "../../models/teamMember.model";
import { Express } from "express"
import { IProject } from "../../models/project.model";
import { connectToTestDb, disconnectFromTestDb } from "../helpers/testDbConfig";
import { baseURL } from "../utils/config";

const baseApi = "/api/v1/teamMember/"

// Helper Functions
export async function createTestTeamMember(app: Express, bodyOptions?: Partial<ITeamMember>): Promise<ITeamMember> {
    const validBody: ITeamMember = {
        name: bodyOptions?.name ? bodyOptions?.name : "Test Team Member",
        ofProject: bodyOptions?.ofProject ? bodyOptions?.ofProject : new mongoose.Types.ObjectId(),
        role: bodyOptions?.role ? bodyOptions?.role : "front-end",
    };

    const res = await supertest(app).post(baseApi).send(validBody);
    expect(res.status).toBe(201);
    return res.body.data
}

export async function deleteTestTeamMember(app: Express, tid: mongoose.Types.ObjectId): Promise<void> {
    const deleteRes = await supertest(app).delete(baseApi + tid);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("TeamMember deleted successfully");
}

describe('TeamMember Tests', () => {

    beforeAll(async () => {
        await connectToTestDb()
    })

    afterAll(async () => {
        await disconnectFromTestDb()
    })


    describe('Create TeamMember', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if no body is passed", async () => {
                const res = await supertest(app).post(baseApi).send();
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Request body cannot be empty");
            });

            it("Should return 400 if any required fields are missing", async () => {
                const incompleteBody: Partial<ITeamMember> = {
                    name: "Test Team Member"
                };

                const res = await supertest(app).post(baseApi).send(incompleteBody);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Missing required fields"); // Adjust this message if your app uses a different one
            });
        });

        describe('Success Tests', () => {
            let testTM: ITeamMember
            afterEach(async () => {
                await deleteTestTeamMember(app, testTM?._id)
            })

            it("Should return 201 if a valid body is passed", async () => {
                const validBody: ITeamMember = {
                    name: "Test Team Member",
                    ofProject: new mongoose.Types.ObjectId(),
                    role: "front-end",
                };

                const res = await supertest(app).post(baseApi).send(validBody);
                expect(res.status).toBe(201);
                expect(res.body.message).toBe("Team member created successfully"); // Adjust based on your success message
                expect(res.body.data).toHaveProperty("name", validBody.name);
                expect(res.body.data).toHaveProperty("role", validBody.role);
                testTM = res.body.data
            });
        });
    })

    describe('Delete TeamMember', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid id is passed", async () => {
                const invalidId = "12345"; // Invalid ObjectId
                const res = await supertest(app).delete(baseApi + invalidId);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Invalid TeamMember ID");
            });

            it("Should return 404 if a non-existing id is passed", async () => {
                const nonExistingId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId that doesn't exist
                const res = await supertest(app).delete(baseApi + nonExistingId);
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("TeamMember not found");
            });
        });

        describe('Success Tests', () => {
            let testTM: ITeamMember
            beforeEach(async () => {
                testTM = await createTestTeamMember(app)
            })

            it("Should return 200 if a valid id is passed", async () => {
                const deleteRes = await supertest(app).delete(baseApi + testTM?._id);
                expect(deleteRes.status).toBe(200);
                expect(deleteRes.body.message).toBe("TeamMember deleted successfully");
            });
        });
    });

    describe('View Project TeamMembers', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid Project ID is passed", async () => {
                const invalidProjectId = "invalidID"; // Invalid ID
                const res = await supertest(app).get(`${baseApi}projectTeamMembers/${invalidProjectId}`);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Invalid Project ID");
            });

            it("Should return 404 if a non-existing Project ID is passed", async () => {
                const nonExistingProjectId = new mongoose.Types.ObjectId(); // Valid ID, doesn't exist
                const res = await supertest(app).get(`${baseApi}projectTeamMembers/${nonExistingProjectId}`);
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("Project not found");
            });
        });

        describe('Success Tests', () => {
            let projectId: mongoose.Types.ObjectId;
            let testTM: ITeamMember;

            it("Should return 200 with all TMs if a valid Project ID is passed", async () => {
                // Before Testing
                // Try exporting the Project's helper methods and using them here
                const newProjectData: IProject = {
                    name: "Test Project from TM Test",
                    deadline: new Date(),
                    description: "Dummy desc ..."
                }
                const newProject = await supertest(app).post(baseURL + "project").send(newProjectData)
                expect(newProject.status).toBe(201)

                projectId = (newProject?.body as IProject)?._id

                const bodyOptions: Partial<ITeamMember> = {
                    ofProject: projectId
                }
                testTM = await createTestTeamMember(app, bodyOptions);

                const res = await supertest(app).get(`${baseApi}projectTeamMembers/${projectId}`);
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ _id: testTM._id })]));

                // // After Testing
                await deleteTestTeamMember(app, testTM._id);
            });

            it("Should return 200 with an empty array if a valid Project ID is passed and no TMs exist", async () => {
                const emptyRes = await supertest(app).get(`${baseApi}projectTeamMembers/${projectId}`);
                expect(emptyRes.status).toBe(200);
                expect(emptyRes.body).toEqual([]);

                // // After Testing
                const response = await supertest(app).delete(
                    baseURL + "project/" + projectId
                );
                expect(response.status).toBe(200);
            });
        });
    });

    describe('Get TeamMembers By ID', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid ID is passed", async () => {
                const invalidId = "invalidID";
                const res = await supertest(app).get(baseApi + invalidId);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Invalid TeamMember ID");
            });

            it("Should return 404 if a non-existing ID is passed", async () => {
                const nonExistingId = new mongoose.Types.ObjectId();
                const res = await supertest(app).get(baseApi + nonExistingId);
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("TeamMember not found");
            });
        });

        describe('Success Tests', () => {
            let testTM: ITeamMember;

            beforeEach(async () => {
                testTM = await createTestTeamMember(app);
            });

            afterEach(async () => {
                await deleteTestTeamMember(app, testTM._id);
            });

            it("Should return 200 and the TM's data if a valid ID is passed", async () => {
                const res = await supertest(app).get(baseApi + testTM._id);
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("name", testTM.name);
                expect(res.body).toHaveProperty("role", testTM.role);
            });
        });
    });

    describe('Update TeamMember', () => {
        describe('Validation Tests', () => {
            it("Should return 400 if an invalid ID is passed", async () => {
                const invalidId = "invalidID";
                const updateBody = { name: "Updated Name" };

                const res = await supertest(app).patch(baseApi + invalidId).send(updateBody);
                expect(res.status).toBe(400);
                expect(res.body.message).toBe("Invalid TeamMember ID");
            });

            it("Should return 404 if a non-existing ID is passed", async () => {
                const nonExistingId = new mongoose.Types.ObjectId();
                const updateBody = { name: "Updated Name" };

                const res = await supertest(app).patch(baseApi + nonExistingId).send(updateBody);
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("TeamMember not found");
            });
        });

        describe('Success Tests', () => {
            let testTM: ITeamMember;

            beforeEach(async () => {
                testTM = await createTestTeamMember(app);
            });

            afterEach(async () => {
                await deleteTestTeamMember(app, testTM._id);
            });

            it("Should return 200 and the updated TM's data if a valid ID is passed", async () => {
                const updateBody = { name: "Updated Name" };

                const res = await supertest(app).patch(baseApi + testTM._id).send(updateBody);
                expect(res.status).toBe(200);
                expect(res.body.data).toHaveProperty("name", updateBody.name);
                expect(res.body.data).toHaveProperty("role", testTM.role);
            });
        });
    });
});