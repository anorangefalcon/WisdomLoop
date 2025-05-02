import mongoose from "mongoose";

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    // normal query that user asked
    question: {
      type: String,
      required: true,
      index: true,
    },
    // answer that supervisor provided
    answer: {
      type: String,
      default: "",
    },
    // we will use this to filter the knowledge base
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["unanswered", "answered"],
      default: "unanswered",
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeBase = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);
KnowledgeBaseSchema.index({ question: "text", answer: "text" });
KnowledgeBaseSchema.index({ status: 1, createdAt: -1 });
KnowledgeBaseSchema.index({ tags: 1 });

export default KnowledgeBase;
