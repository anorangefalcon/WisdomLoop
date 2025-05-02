import app from "./src/app.js";
import * as http from "http";
import connectDB from "./src/config/db.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
