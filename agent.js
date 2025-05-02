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
import { fileURLToPath } from "url";
import {
  model,
  salonSystemPrompt,
  startMessage,
} from "./src/Agent/constants.js";
import tools from "./src/Agent/tools.js";

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
      text: salonSystemPrompt,
    });

    await ctx.connect(undefined, AutoSubscribe.AUDIO_ONLY);
    console.log("waiting for participant");
    const participant = await ctx.waitForParticipant();
    console.log(`starting agent for ${participant.identity}`);

    const agent = new pipeline.VoicePipelineAgent(
      vad,
      new deepgram.STT(),
      new openai.LLM({
        model: model,
      }),
      new openai.TTS(),
      {
        chatCtx: initialContext,
        fncCtx: tools,
        turnDetector: new livekit.turnDetector.EOUModel(),
      }
    );
    agent.start(ctx.room, participant);

    await agent.say(startMessage, true);
  },
};

export default defineAgent(agentDefinition);
cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
