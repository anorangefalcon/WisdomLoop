import axios from "axios";

export async function searchKnowledgeBase(query, tags) {
  try {
    const response = await axios.post(
      `${process.env.SERVER_URL}/api/knowledge/search`,
      {
        query,
        tags,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return { success: false, data: [] };
  }
}

export async function checkWithSupervisor(question, tags) {
  try {
    const response = await axios.post(
      `${process.env.SERVER_URL}/api/knowledge/new`,
      {
        question,
        tags,
      }
    );

    const { requestId } = response.data;

    return new Promise((resolve) => {
      let timeoutId;
      const interval = setInterval(async () => {
        try {
          const result = await getParticularKnowledge(requestId);
          if (
            result.success &&
            result.data.status === "answered" &&
            result.data.answer.length > 0
          ) {
            clearInterval(interval);
            clearTimeout(timeoutId);
            resolve("Supervisor answered: " + result.data.answer);
          }
        } catch (error) {
          console.error("Error checking for answer:", error);
        }
      }, 5000);

      timeoutId = setTimeout(() => {
        clearInterval(interval);
        resolve(
          "Supervisor is not available right now, please try again later"
        );
      }, 30000);
    });
  } catch (error) {
    console.error("Error requesting help from supervisor:", error);
    return "Supervisor is not available right now, please directly contact us";
  }
}

async function getParticularKnowledge(id) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/knowledge/${id}/answer`
  );

  return response.data;
}
