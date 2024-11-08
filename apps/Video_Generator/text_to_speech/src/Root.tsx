import React, { useState, useEffect } from 'react';
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition } from "remotion";
import { HelloWorld, mySchema } from "./HelloWorld";
import { getTTSFromServer } from "./lib/client-utils";
import { waitForNoInput } from "./debounce";
import axios from 'axios';

export const RemotionRoot = () => {
  const [responseData, setResponseData] = useState(null);
  const [dialogue, setDialogue] = useState({ introduction: [], fertilizer: [], weather: [] });
  const [userDetails, setUserDetails] = useState(null);
  const FPS = 30;

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/submit");
      const userData = response.data;
      console.log("Fetched user data:", userData);
      setUserDetails(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchData = async () => {
    const userData = await fetchUserData();
    if (!userData) {
      setDialogue({ introduction: ["Error fetching user details."], fertilizer: [], weather: [] });
      return;
    }

    const randomCrop = userData.selectedcrop;
    const promptText = `
      Provide exactly three separate 6-slide dialogues in Telugu for an agricultural introduction video focusing on ${randomCrop}.
      Farmer: ${userData.username}
      Location: ${userData.location || "Adilabad"} with Clay soil.
      Month: October 2024, ${userData.location || "Adilabad"} weather.

      Each set of 6 slides should cover the following topics, and each slide should be a concise string in Telugu.

      Dialogue Set 1: Introduction and Crop Overview
      - Slide 1: Greet the farmer and introduce the purpose of this guidance.
      - Slide 2: Overview of ${randomCrop} crop, benefits for ${userData.location || "Adilabad"}.
      - Slide 3: Ideal planting time and season recommendations for ${randomCrop}.
      - Slide 4: Describe Clay soil characteristics and how to prepare it for ${randomCrop}.
      - Slide 5: Key care tips to help ${randomCrop} thrive.
      - Slide 6: Expected yield and benefits, closing with encouragement.

      Dialogue Set 2: Fertilizer and Pest Management
      - Slide 1: Importance of nutrient management for ${randomCrop}.
      - Slide 2: Key fertilizers required for ${randomCrop}, with recommended quantities and frequency.
      - Slide 3: Pesticide types and usage instructions for common pests.
      - Slide 4: Safety measures for fertilizer and pesticide application.
      - Slide 5: Tips on organic alternatives if available for ${randomCrop}.
      - Slide 6: Closing advice on maintaining healthy crop growth.

      Dialogue Set 3: Weather and Water Management
      - Slide 1: Overview of typical October weather in ${userData.location || "Adilabad"}.
      - Slide 2: How to adapt ${randomCrop} planting to expected temperatures and rainfall.
      - Slide 3: Water management practices for ${randomCrop} and ideal irrigation frequency.
      - Slide 4: Weather-related risks and mitigation tips.
      - Slide 5: Signs of over-watering or drought stress in ${randomCrop}.
      - Slide 6: Closing message on successful water management.

      **Return only the response as a JSON object** structured as follows:
      {
        "introduction": ["Slide 1 text in Telugu", "Slide 2 text in Telugu", ..., "Slide 6 text in Telugu"],
        "fertilizer": ["Slide 1 text in Telugu", "Slide 2 text in Telugu", ...,"Slide 6 text in Telugu"],
        "weather": ["Slide 1 text in Telugu", "Slide 2 text in Telugu", ...,"Slide 6 text in Telugu"]
      }

      Do not include any additional text or explanations outside of the JSON format and make sure there is sufficient data and there are exactly six slides per set please dont make any mistake and each slide should have 18 words.
    `;

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCg_BJDs_peYZc9TZQ25CM2-ubk8fpSSu4';
    const data = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseText = response.data.candidates[0].content.parts[0].text;
      const cleanedText = responseText.replace(/```json|```/g, '').trim();

      const parsedResponse = JSON.parse(cleanedText);
      console.log("Parsed Dialogues:", parsedResponse);

      setDialogue({
        introduction: parsedResponse.introduction || [],
        fertilizer: parsedResponse.fertilizer || [],
        weather: parsedResponse.weather || []
      });
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      setDialogue({ introduction: ["Error parsing dialogue from response."], fertilizer: [], weather: [] });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {['introduction', 'fertilizer', 'weather'].map((set, idx) => (
        <Composition
          key={idx}
          id={`HelloWorld-${set}`}  // Modified to use only allowed characters
          schema={mySchema}
          component={HelloWorld}
          durationInFrames={300}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{
            dialogue: dialogue[set].length ? dialogue[set] : [`No content available for ${set}`],
            titleColor: "#2E8AEA",
            voice: "Woman (Telugu)",
            pitch: 0,
            speakingRate: 1.1,
            audioUrl: null,
          }}
          calculateMetadata={async ({ props, abortSignal }) => {
            await waitForNoInput(abortSignal, 1000);
            const audioUrl = await getTTSFromServer({ ...props, dialogue: dialogue[set] });
            const audioDurationInSeconds = await getAudioDurationInSeconds(audioUrl);
            const calculatedVideoDuration = Math.ceil(audioDurationInSeconds);

            return {
              props: {
                ...props,
                audioUrl,
                dialogue: dialogue[set]
              },
              durationInFrames: 30 + calculatedVideoDuration * FPS,
            };
          }}
        />
      ))}
    </div>
  );
};
