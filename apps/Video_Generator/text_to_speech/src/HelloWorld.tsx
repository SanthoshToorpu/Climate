import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio
} from "remotion";
import { Slide1 } from "./Slides/Slide1";
import { voices } from "./server/TextToSpeech/constants";
import { RequestMetadata, VoiceType } from "./lib/interfaces";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Define the type for the CSV data
type ExtractedValues = {
  [key: string]: string;
};

// Define the schema for the CSV data
export const mySchema = z.object({
  dialogue: z.array(z.string()),
  titleColor: zColor(),
  voice: z.enum(
    Object.keys(voices) as [VoiceType] | [VoiceType, ...VoiceType[]]
  ),
  pitch: z.number().min(-20).max(20),
  speakingRate: z.number().min(0.25).max(4),
  audioUrl: z.string().nullable(),
});

export const HelloWorld: React.FC<RequestMetadata> = (props) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const opacity = interpolate(
    frame,
    [videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        flex: 1,
        background: "white",
        position: "relative",
      }}
    >
      {props.audioUrl && (
        <Audio id="TTS Audio" about="TTS Audio" src={props.audioUrl} />
      )}
      <div style={{ opacity }}>
        <Sequence from={0} durationInFrames={200}>
          <Slide1 text1={props.dialogue[0]} />
        </Sequence>
        <Sequence from={200} durationInFrames={200}>
          <Slide1 text1={props.dialogue[1]} />
        </Sequence>
        <Sequence from={400} durationInFrames={200}>
          <Slide1 text1={props.dialogue[2]} />
        </Sequence>
        <Sequence from={600} durationInFrames={200}>
          <Slide1 text1={props.dialogue[3]} />
        </Sequence>
        <Sequence from={800} durationInFrames={200}>
          <Slide1 text1={props.dialogue[4]} />
        </Sequence>
        <Sequence from={1000} durationInFrames={200}>
          <Slide1 text1={props.dialogue[5]} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
