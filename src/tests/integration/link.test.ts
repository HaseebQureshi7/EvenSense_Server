import { Express } from "express"
import { ILink } from "../../models/link.model";
import mongoose from "mongoose";
import { connectToTestDb, disconnectFromTestDb } from "../helpers/testDbConfig";
import { baseURL } from "../utils/config";
import supertest from "supertest";
import app from "../../app";
import { IProject } from "../../models/project.model";

const baseApi = baseURL + "link/";

// Helper Functions
export async function createTestLink(app: Express, bodyOptions?: Partial<ILink>): Promise<ILink> {
    const testLinkBody: ILink = {
        name: bodyOptions?.name ? bodyOptions?.name : "Test Link",
        url: bodyOptions?.url ? bodyOptions?.url : "https://www.example.com",
        type: bodyOptions?.type ? bodyOptions?.type : "doc",
        ofProject: bodyOptions?.ofProject ? bodyOptions?.ofProject : new mongoose.Types.ObjectId(),
    };
    const res = await supertest(app).post(baseURL + "/link").send(testLinkBody);
    expect(res.status).toBe(201);
    return res.body
}

export async function deleteTestLink(app: Express, lid: mongoose.Types.ObjectId): Promise<void> {
    const res = await supertest(app).delete(baseApi + lid)
    expect(res.status).toBe(200);
    return
}

describe("Link Tests", () => {

    beforeAll(async () => {
        await connectToTestDb()
    })

    afterAll(async () => {
        await disconnectFromTestDb()
    })


    describe("Create Link", () => {
        describe("Validation Tests", () => {
            it("Should return 400 if a empty body is passed", async () => {
                const res = await supertest(app).post(baseApi).send()
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Request body cannot be empty")
            })

            it("Should return 400 if required fields are missing", async () => {
                const testLinkBody: Partial<ILink> = {
                    name: "Test Link",
                    url: "https://ipvt.vercel.app"
                }
                const res = await supertest(app).post(baseApi).send(testLinkBody)
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Missing required fields")
            })
        })

        describe("Success Tests", () => {
            let createdTestLink: ILink;

            afterEach(async () => {
                await deleteTestLink(app, createdTestLink?._id)
            })

            it("Should return 201 if a valid body is provided", async () => {
                const testLinkBody: ILink = {
                    name: "Test Link",
                    url: "https://www.example.com",
                    type: "doc",
                    ofProject: new mongoose.Types.ObjectId(),
                };
                const res = await supertest(app).post(baseURL + "/link").send(testLinkBody);
                expect(res.status).toBe(201);
                expect(res.body.name).toBe(testLinkBody.name);
                createdTestLink = res.body
            })
        })
    })

    describe("Delete Link", () => {
        describe("Validation Tests", () => {
            it("Should return 400 if an invalid link id is provided", async () => {
                const res = await supertest(app).delete(baseApi + "invalid-id")
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Invalid link ID");
            })
            it("Should return 404 if an non-existing link id is provided", async () => {
                const nonExistingId = new mongoose.Types.ObjectId(); // Valid ObjectId but not in the database
                const res = await supertest(app).delete(baseApi + nonExistingId)
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("Link not found");
            })
        })

        describe("Success Tests", () => {
            let createdTestLink: ILink;

            beforeEach(async () => {
                createdTestLink = await createTestLink(app)
            })

            it("Should return 200 if a valid link id is provided", async () => {
                const res = await supertest(app).delete(baseApi + createdTestLink?._id)
                expect(res.status).toBe(200);
                expect(res.body.message).toBe("Link deleted successfully");
            })
        })
    })

    describe("Get Project Links", () => {
        const testProjectID = new mongoose.Types.ObjectId()

        describe("Validation Tests", () => {
            it("Should return 400 if an invalid project id is provided", async () => {
                const res = await supertest(app).get(baseApi + "invalid-id");
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Invalid link ID")
            })

            it("Should return 404 if an non-existing project id is provided", async () => {
                const res = await supertest(app).get(baseApi + testProjectID);
                expect(res.status).toBe(404)
                expect(res.body.message).toBe("Link Project not found")
            })
        })

        describe("Success Tests", () => {
            let createdTestLink: ILink;
            let createdTestProject: IProject;

            beforeAll(async () => {
                const testProjectBody: IProject = {
                    name: "Test Project",
                    deadline: new Date(),
                    description: "dummy desc ..."
                }
                const createdTestProjectRes = await supertest(app).post(baseURL + "project").send(testProjectBody)
                expect(createdTestProjectRes.status).toBe(201)

                createdTestProject = createdTestProjectRes.body

                const options: Partial<ILink> = {
                    ofProject: createdTestProject?._id
                }
                createdTestLink = await createTestLink(app, options);
            })

            afterAll(async () => {
                if (createdTestLink?._id) {
                    await deleteTestLink(app, createdTestLink._id)
                }
                await supertest(app).delete(baseURL + "project/" + createdTestProject?._id);

            })

            it("Should return 200 and its data if a valid project id is provided", async () => {
                const res = await supertest(app).get(baseApi + createdTestProject?._id);
                expect(res.status).toBe(200)
                expect(res.body[0].name).toBe(createdTestLink?.name)
            })
        })
    })

    describe("Get Types of Project Links", () => {
        const testProjectID = new mongoose.Types.ObjectId()

        describe("Validation Tests", () => {
            it("Should return 400 if an invalid project id is provided", async () => {
                const res = await supertest(app).get(baseApi + "linkType/invalid-id");
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Invalid link ID")
            })

            it("Should return 404 if an non-existing project id is provided", async () => {
                const res = await supertest(app).get(baseApi + "linkType/" + testProjectID);
                expect(res.status).toBe(404)
                expect(res.body.message).toBe("Link Project not found")
            })

            it("Should return 400 if an invalid type(query param) is provided", async () => {
                // Creating a Test Project
                const testProjectBody: IProject = {
                    name: "Test Project form query param test",
                    deadline: new Date(),
                    description: "dummy desc ..."
                }
                const createdTestProjectRes = await supertest(app).post(baseURL + "project").send(testProjectBody)
                expect(createdTestProjectRes.status).toBe(201)

                const createdTestProject: IProject = createdTestProjectRes.body

                // TEST
                const res = await supertest(app).get(baseApi + "linkType/" + createdTestProject?._id);
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Missing Query <type>")

                // Deleting the Created Test Project
                const deletedTestProject = await supertest(app).delete(baseURL + "project/" + createdTestProject._id);
                expect(deletedTestProject.status).toBe(200)

            })
        })

        describe("Success Tests", () => {
            it("Should return 200 if a valid project id & type(query param) is provided", async () => { })
        })
    })

    describe("Update Link", () => {
        const testProjectID = new mongoose.Types.ObjectId()

        describe("Validation Tests", () => {
            it("Should return 400 if an invalid link id is provided", async () => {
                const res = await supertest(app).patch(baseApi + "invalid-id");
                expect(res.status).toBe(400)
                expect(res.body.message).toBe("Invalid link ID")
            })
            it("Should return 404 if an non-existing link id is provided", async () => {
                const res = await supertest(app).patch(baseApi + testProjectID);
                expect(res.status).toBe(404)
                expect(res.body.message).toBe("Link not found")
            })
        })

        describe("Success Tests", () => {
            let createdTestLink: ILink;

            beforeEach(async () => {
                createdTestLink = await createTestLink(app)
            })

            afterEach(async () => {
                await deleteTestLink(app, createdTestLink?._id)
            })

            it("Should return 200 if a valid link id is provided", async () => {
                const updatedLinkData: Partial<ILink> = {
                    name: "Updated Link Name"
                }
                const res = await supertest(app).patch(baseApi + createdTestLink._id).send(updatedLinkData)
                expect(res.status).toBe(200)
                expect(res.body.message).toBe("Link updated successfully")
                expect(res.body.data.name).toBe("Updated Link Name")
            })
        })
    })
})