import { z } from "zod";
import { checkWithSupervisor, searchKnowledgeBase } from "./tools.executers.js";

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
      return "No relevant data found in the knowledge base. Ask a supervisor for help.";
    }

    const answer = {
      suggestion:
        "If you think data is not relevant to user's query, request human help",
      data: result.data,
    };
    console.log(`[searchKnowledge](toolAnswer): `, answer);
    return answer;
  },
};

const requestHumanHelp = {
  description:
    "Use this tool to request help from a supervisor. This is used when the agent is unsure about the answer to a question.",
  parameters: z.object({
    question: z
      .string()
      .describe("The customer's question to ask the supervisor"),
    tags: z
      .array(z.string())
      .describe(
        "Tags related to the question. For example: if question is 'what is the price of a haircut', tags can be ['haircut', 'pricing']"
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

export default {
  searchKnowledge,
  requestHumanHelp,
  bookAppointment,
};
