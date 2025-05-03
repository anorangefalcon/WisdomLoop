import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class EmbeddingService {
  constructor() {
    this.embeddingModel = "text-embedding-3-small";
  }

  async generateEmbedding(text) {
    if (!text) return null;

    const cleanedText = text.replace(/\s+/g, " ").trim();

    try {
      return await this.generateOpenAIEmbedding(cleanedText);
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  }

  async generateOpenAIEmbedding(text) {
    if (!openaiClient) {
      throw new Error("OpenAI client is not initialized. Check your API key.");
    }

    const response = await openaiClient.embeddings.create({
      model: this.embeddingModel,
      input: text,
    });

    return response.data[0].embedding;
  }

  async generateCombinedEmbedding(question, answer = "", tags = []) {
    const combinedText = [question, answer, tags.join(" ")]
      .filter(Boolean)
      .join(" ");

    return await this.generateEmbedding(combinedText);
  }
}

export default new EmbeddingService();
