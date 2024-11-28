import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import router from "./routes/router";
const app = express();

dotenv.config();

const corsOptions: CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running 🎉" });
});

app.use("/api/v1", router);

export default app;
