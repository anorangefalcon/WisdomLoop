import {
  AutoSubscribe,
  WorkerOptions,
  cli,
  defineAgent,
  llm,
  pipeline,
} from "@livekit/agents";
import * as deepgram from "@livekit/agents-plugin-deepgram";
import * as livekit from "@livekit/agents-plugin-livekit";
import * as openai from "@livekit/agents-plugin-openai";
import * as silero from "@livekit/agents-plugin-silero";
// import { z } from "zod";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();

export const agentDefinition = {
  prewarm: async (proc) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx) => {
    const vad = ctx.proc.userData.vad;
    const initialContext = new llm.ChatContext().append({
      role: llm.ChatRole.SYSTEM,
      text: "You are a helpful voice assistant",
    });

    await ctx.connect(undefined, AutoSubscribe.AUDIO_ONLY);
    console.log("waiting for participant");
    const participant = await ctx.waitForParticipant();
    console.log(`starting agent for ${participant.identity}`);

    const fncCtx = {
      // add tools here, eg:
      // weather: {
      //   description: "Get the weather in a location",
      //   parameters: z.object({
      //     location: z.string().describe("The location to get the weather for"),
      //   }),
      //   execute: async ({ location }) => {
      //     console.debug(`executing weather function for ${location}`);
      //     const response = await fetch(
      //       `https://wttr.in/${location}?format=%C+%t`
      //     );
      //     if (!response.ok) {
      //       throw new Error(`Weather API returned status: ${response.status}`);
      //     }
      //     const weather = await response.text();
      //     return `The weather in ${location} right now is ${weather}.`;
      //   },
      // },
    };

    const agent = new pipeline.VoicePipelineAgent(
      vad,
      new deepgram.STT(),
      new openai.LLM(),
      new openai.TTS(),
      {
        chatCtx: initialContext,
        fncCtx,
        turnDetector: new livekit.turnDetector.EOUModel(),
      }
    );
    agent.start(ctx.room, participant);

    await agent.say("Hey, how can I help you today", true);
  },
};

export default defineAgent(agentDefinition);
cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
