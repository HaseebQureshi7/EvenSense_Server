import express, { Request, Response } from "express";
const app = express();

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running 🎉" });
});

export default app;
