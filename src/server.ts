import app from "./app";

const server = app

server.listen(3000, () => {
    return console.log(`Express is listening at http://localhost:${3000}`);
  });