import express from "express";
import {
  getAllKnowledge,
  searchKnowledge,
  requestNewKnowledge,
  updateKnowledge,
} from "../controllers/KnowledgeBaseController.js";

const router = express.Router();

router.get("/get", getAllKnowledge);
router.post("/new", requestNewKnowledge);
router.post("/search", searchKnowledge);
router.put("/:id/answer", updateKnowledge);

export default router;
