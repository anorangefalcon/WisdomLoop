import KnowledgeBase from "../models/KnowledgeBase.js";

export const getAllKnowledge = async (req, res) => {
  try {
    // Custom sort to prioritize unanswered entries
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

    console.log(`[For Supervisor]: New question from customer "${question}"`);

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

export const searchKnowledgeBase = async (query, tags = []) => {
  try {
    const searchQuery = {
      status: "answered",
    };

    if (!query && (!tags || tags.length === 0)) {
      return {
        success: false,
        message: "Please provide a search query or tags",
        data: [],
      };
    }

    searchQuery.$or = [
      { question: { $regex: query, $options: "i" } },
      { answer: { $regex: query, $options: "i" } },
    ];
    searchQuery.tags = { $in: tags };

    const entries = await KnowledgeBase.find(searchQuery)
      .select("question answer")
      .limit(3)
      .maxTimeMS(5000);

    return {
      success: true,
      data: entries,
    };
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return {
      success: false,
      message: "Error searching knowledge base",
      data: [],
    };
  }
};
