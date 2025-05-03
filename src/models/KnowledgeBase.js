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
    embedding: {
      type: [Number],
      default: null,
      index: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for backward compatibility
KnowledgeBaseSchema.index({ question: "text", answer: "text" });
KnowledgeBaseSchema.index({ status: 1, createdAt: -1 });
KnowledgeBaseSchema.index({ status: 1, updatedAt: -1 });
KnowledgeBaseSchema.index({ tags: 1 });

// Add vector search index reference that matches the Atlas index name "embeddingIndex"
KnowledgeBaseSchema.index(
  { embedding: "vector" },
  {
    name: "embeddingIndex", // Using the exact name you created in Atlas
    vector: {
      dimensions: 1536, // For text-embedding-3-small which has 1536 dimensions
      similarity: "cosine",
    },
  }
);

const KnowledgeBase = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);

export default KnowledgeBase;
