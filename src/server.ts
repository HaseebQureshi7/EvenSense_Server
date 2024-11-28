import app from "./app";
import connectToDb from "./config/connectToDb.config";

const server = app;
const PORT = process.env.PORT;

connectToDb()

server.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
