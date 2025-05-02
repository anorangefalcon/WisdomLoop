import axios from "axios";
import { z } from "zod";

const bookAppointment = {
  description: "Book an appointment at the salon",
  parameters: z.object({
    name: z.string().describe("The name of the client"),
    service: z.string().describe("The service to book"),
    date: z.string().describe("The date of the appointment"),
    time: z.string().describe("The time of the appointment"),
  }),
  execute: async ({ name, service, date, time }) => {
    console.log(
      `[bookAppointment](tool): Appointment booked for ${name} for ${service} on ${date} at ${time}`
    );
    // we can add logic here later to save the appointment in a database or send a confirmation email
    return `Your appointment for ${service} on ${date} at ${time} has been booked.`;
  },
};

const searchKnowledge = {
  description:
    "Search the knowledge base for an answer to customer's question. Use this tool when you are not sure about the answer & want to retrieve more information.",
  parameters: z.object({
    query: z
      .string()
      .describe("The customer's question to search for in the knowledge base"),
    tags: z
      .array(z.string())
      .describe(
        "Tags to help narrow down the search, form tags related to the question. For example: if query is 'what is the price of a haircut', tags can be ['haircut', 'pricing']"
      ),
  }),
  execute: async ({ query, tags = [] }) => {
    console.log(
      `[searchKnowledge](tool): Searching existing knowledge for: ${query}, tags: ${tags.join(
        ", "
      )}`
    );

    const result = await searchKnowledgeBase(query, tags);

    if (!result.success || result.data.length === 0) {
      return "NO data, reply : I'm sorry, but I am unsure about your question, Please hold on while I check with my supervisor. [execute requestHumanHelp tool]";
    }

    const answer = {
      developer:
        "If you think data is not relevant to user's query, request human help",
      data: result.data,
    };
    return JSON.stringify(answer);
  },
};

const requestHumanHelp = {
  description:
    "Use this tool when you don't know the answer, have already checked knowledge base & want to request help from a human supervisor",
  parameters: z.object({
    question: z
      .string()
      .describe("The customer's question to search for in the knowledge base"),
    tags: z
      .array(z.string())
      .describe(
        "Tags to help narrow down the search, form tags related to the question. For example: if question is 'what is the price of a haircut', tags can be ['haircut', 'pricing']"
      ),
  }),
  execute: async ({ question, tags = [] }) => {
    console.log(
      `[requestHumanHelp](tool): Requesting help for customer: ${question}, tags: ${tags.join(
        ", "
      )}`
    );

    return await checkWithSupervisor(question, tags);
  },
};

async function searchKnowledgeBase(query, tags) {
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/knowledge/search`,
    {
      query,
      tags,
    }
  );

  return response.data;
}

async function checkWithSupervisor(question, tags) {
  console.log(
    `[For Supervisor](tool): New question from customer "${question}"`
  );

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
          console.log(
            `[requestHumanHelp](tool): Supervisor answered: ${result.data.answer}`
          );
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
      console.log(
        `[requestHumanHelp](tool): Supervisor did not respond in time, please try again later`
      );
      resolve("Supervisor is not available right now, please try again later");
    }, 30000);
  });
}

async function getParticularKnowledge(id) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/knowledge/${id}/answer`
  );

  return response.data;
}

export default {
  bookAppointment,
  searchKnowledge,
  requestHumanHelp,
};
