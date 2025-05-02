import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import knowledgeBaseRoutes from "./routes/knowledgeBase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/knowledge", knowledgeBaseRoutes);

export default app;
