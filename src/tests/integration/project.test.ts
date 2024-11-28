import supertest from "supertest";
import app from "../../app";
import { IProject } from "../../models/project.model";
import mongoose from "mongoose";

describe("Project API", () => {
  const baseURL = "/api/v1/";

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
  });

  // describe("Create Project", () => {
  //   describe("Validation Tests", () => {
  //     it("Should return 400 if no body is provided", async () => {
  //       const response = await supertest(app)
  //         .post(baseURL + "project")
  //         .send();
  //       expect(response.status).toBe(400);
  //       expect(response.body.message).toBe("Body is required");
  //     });

  //     it("Should return 400 if required fields are missing", async () => {
  //       const reqBody: Partial<IProject> = {
  //         name: "Test Project",
  //         deadline: new Date(),
  //       };
  //       const response = await supertest(app)
  //         .post(baseURL + "project")
  //         .send(reqBody);
  //       expect(response.status).toBe(400);
  //       expect(response.body.message).toContain("Missing fields in the body");
  //     });
  //   });

  //   describe("Success Tests", () => {
  //     const projectData: IProject = {
  //       name: "Test Project",
  //       deadline: new Date(),
  //       description: "Test Description",
  //       status: "active",
  //     };

  //     it("Should return 201 for valid project data", async () => {
  //       const response = await supertest(app)
  //         .post(baseURL + "project")
  //         .send(projectData);
  //       expect(response.status).toBe(201);
  //       expect(response.body.name).toBe(projectData.name);
  //     });

  //     it("Should return 400 for duplicate project names", async () => {
  //       const response = await supertest(app)
  //         .post(baseURL + "project")
  //         .send(projectData);
  //       expect(response.status).toBe(400);
  //       expect(response.body.message).toContain("Project name must be unique");
  //     });
  //   });
  // });

  describe("View All Projects", () => {
    // No Validation tests

    describe("Success Tests", () => {
      it("Should return status 200 and all projects with appropriate message ", async () => {
        const response = await supertest(app).get(baseURL + "project");
        expect(response.status).toBe(200);
        if (Array.isArray(response.body)) {
          expect(response.body.length).toBeGreaterThan(0);
        } else {
          expect(response.body.message).toBe("No projects found");
        }
      });
    });
  });

  describe("View Project By Id", () => {
    it("Should return 200 status and the Project ", () => {
      
    })
  })

});
