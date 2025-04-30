import app from "./src/app.js";
import * as http from "http";

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server running: port ${PORT}`);
});
