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

export default {
  bookAppointment,
};
