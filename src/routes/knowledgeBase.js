import express from "express";
import {
  getAllKnowledge,
  searchKnowledge,
  requestNewKnowledge,
  updateKnowledge,
  searchParticularKnowledge,
} from "../controllers/KnowledgeBaseController.js";

const router = express.Router();

router.get("/get", getAllKnowledge);
router.post("/new", requestNewKnowledge);
router.post("/search", searchKnowledge);
router.get("/:id/answer", searchParticularKnowledge);
router.put("/:id/answer", updateKnowledge);

export default router;
