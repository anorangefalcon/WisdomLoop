import KnowledgeBase from "../models/KnowledgeBase.js";
import EmbeddingService from "../services/EmbeddingService.js";

export const getAllKnowledge = async (req, res) => {
  try {
    const entries = await KnowledgeBase.aggregate([
      {
        $addFields: {
          sortPriority: {
            $cond: { if: { $eq: ["$status", "unanswered"] }, then: 0, else: 1 },
          },
        },
      },
      { $sort: { sortPriority: 1, updatedAt: -1, createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching entries: " + error.message,
    });
  }
};

export const searchKnowledge = async (req, res) => {
  try {
    const { query, tags = [] } = req.body;

    if (!query && (!tags || tags.length === 0)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a search query or tags",
      });
    }

    const result = await searchKnowledgeBase(query, tags);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const createUnansweredKnowledgeQuery = async (question, tags = []) => {
  try {
    const newEntry = new KnowledgeBase({
      question,
      tags,
      status: "unanswered",
      answer: "",
    });

    await newEntry.save();

    return {
      success: true,
      message: "Query created successfully",
      requestId: newEntry._id,
    };
  } catch (error) {
    console.error("Error creating query:", error);
    return {
      success: false,
      message: "Failed to create query",
    };
  }
};

export const requestNewKnowledge = async (req, res) => {
  try {
    const { question, tags = [] } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    const result = await createUnansweredKnowledgeQuery(question, tags);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const updateKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        error: "Answer is required",
      });
    }

    const entry = await KnowledgeBase.findById(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Entry not found",
      });
    }

    entry.answer = answer;
    entry.status = "answered";

    const embedding = await EmbeddingService.generateCombinedEmbedding(
      entry.question,
      answer,
      entry.tags
    );

    entry.embedding = embedding;

    await entry.save();

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const searchKnowledgeBase = async (query, tags = []) => {
  try {
    if (!query) {
      return {
        success: false,
        message: "Please provide a search query",
        data: [],
      };
    }

    const maxResults = 3;

    const queryEmbedding = await EmbeddingService.generateEmbedding(query);

    if (!queryEmbedding || queryEmbedding.length === 0) {
      console.error("Failed to generate embedding");
      return {
        success: false,
        message: "Could not generate embedding for search query",
        data: [],
      };
    }

    let pipeline = [
      {
        $search: {
          index: "embeddingIndex",
          knnBeta: {
            vector: queryEmbedding,
            path: "embedding",
            k: maxResults,
          },
        },
      },
    ];

    let matchStage = { status: "answered" };
    pipeline.push({ $match: matchStage });

    pipeline.push({
      $project: {
        question: 1,
        answer: 1,
        tags: 1,
        score: { $meta: "searchScore" },
        _id: 1,
      },
    });

    const results = await KnowledgeBase.aggregate(pipeline);

    console.log(`Vector search found ${results ? results.length : 0} results`);

    return {
      success: true,
      data: results || [],
      count: results ? results.length : 0,
      query: query,
    };
  } catch (error) {
    console.error("Error in knowledge base search:", error);
    return {
      success: false,
      message: "Error searching knowledge base",
      error: error.message,
      data: [],
    };
  }
};

export const searchParticularKnowledge = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await KnowledgeBase.findById(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "knowledge not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        question: entry.question,
        answer: entry.answer,
        status: entry.status,
      },
    });
  } catch (error) {
    console.error("Error fetching entry:", error);
    res.status(500).json({
      success: false,
      error: "error fetching knowledge base entry",
    });
  }
};
