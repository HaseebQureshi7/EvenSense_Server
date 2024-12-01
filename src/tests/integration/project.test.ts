// Improper / inconsistent tests written
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
    describe("Validation Tests", () => {
      it("Should return 400 for an invalid project id", async () => {
        const response = await supertest(app).get(baseURL + "project/wrong-id");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid project ID");
      });
      it("Should return 404 for non-existing id", async () => {
        const response = await supertest(app).get(
          baseURL + "project/574c9eebf7c283771255687c"
        );
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Project not found");
      });
    });

    describe("Success Tests", () => {
      // Creating a Test Project
      let testProject: IProject;
      beforeAll(async () => {
        const projectData: IProject = {
          name: "Test Project" + Math.random(),
          deadline: new Date(),
          description: "Test Description",
          status: "active",
        };
        const response = await supertest(app)
          .post(baseURL + "project")
          .send(projectData);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(projectData.name);
        testProject = response.body;
      });

      afterAll(async () => {
        const response = await supertest(app).delete(
          baseURL + "project/" + testProject?._id
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Project deleted successfully");
        expect(response.body.deletedProject?.name).toBe(testProject.name);
      });

      it("Should return 200 for valid project id", async () => {
        const response = await supertest(app).get(
          baseURL + "project/" + testProject?._id
        );
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(testProject.name);
      });
    });
  });

  describe("Edit Project", () => {
    describe("Validation Tests", () => {
      it("Should return 400 if an empty body is passed", async () => {
        const response = await supertest(app)
          .patch(baseURL + "project/1234567890") // Assuming 1234567890 is a valid ObjectId
          .send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Request body cannot be empty");
      });

      it("Should return 400 for an invalid project id", async () => {
        const response = await supertest(app)
          .patch(baseURL + "project/invalid-id")
          .send({ name: "Updated Project" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid project ID");
      });

      it("Should return 404 for an non existing project id", async () => {
        const response = await supertest(app)
          .patch(baseURL + "project/507f191e810c19729de860ea")
          .send({ name: "Updated Project" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Project not found");
      });
    });

    describe("Success Tests", () => {
      // Creating a Test Project
      let testProject: IProject;
      beforeAll(async () => {
        const projectData: IProject = {
          name: "Test Project " + Math.random(),
          deadline: new Date(),
          description: "Test Description",
          status: "active",
        };
        const response = await supertest(app)
          .post(baseURL + "project")
          .send(projectData);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(projectData.name);
        testProject = response.body;
      });

      afterAll(async () => {
        const response = await supertest(app).delete(
          baseURL + "project/" + testProject?._id
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Project deleted successfully");
        // expect(response.body.deletedProject?.name).toBe(testProject.name);
      });

      it("Should return 200 for a valid project id", async () => {
        const fullUpdate = {
          name: "Fully Updated Project",
          deadline: new Date(),
          description: "Fully Updated Description",
          status: "completed",
        };
        const response = await supertest(app)
          .patch(baseURL + "project/" + testProject._id)
          .send(fullUpdate);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Project updated successfully");
        expect(response.body.updatedProject.name).toBe(fullUpdate.name);
        expect(response.body.updatedProject.description).toBe(
          fullUpdate.description
        );
        expect(response.body.updatedProject.status).toBe(fullUpdate.status);
      });
    });
  });

  describe("Delete Project", () => {
    describe("Validation Tests", () => {
      it("Should return 404 if wrong project id is provided", async () => {
        const response = await supertest(app).delete(
          baseURL + "project/507f191e810c19729de860ea"
        );
        expect(response.status).toBe(404);
        console.log(response.body);
        expect(response.body.message).toBe("Project not found");
      });
    });

    describe("Success Tests", () => {
      // Creating a Test Project
      let testProject: IProject;
      beforeAll(async () => {
        const projectData: IProject = {
          name: "Test Project Delete" + Math.random(),
          deadline: new Date(),
          description: "Test Description",
          status: "active",
        };
        const response = await supertest(app)
          .post(baseURL + "project")
          .send(projectData);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(projectData.name);
        testProject = response.body;
      });

      it("Should return 200 status and delete the project", async () => {
        const response = await supertest(app).delete(
          baseURL + "project/" + testProject?._id
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Project deleted successfully");
      });
    });
  });
});
