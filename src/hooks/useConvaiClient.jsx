import axios from "axios";
import { ConvaiClient } from "convai-web-sdk"
import { useEffect, useRef, useState } from "react";


export function useConvaiClient(characterId, apiKey) {
  const [userText, setUserText] = useState("");
  const [npcText, setNpcText] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [enter, setEnter] = useState(0);
  const [audioPlay, setAudioPlay] = useState(false);
  const [keyPressed, setKeyPressed] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [npcName, setNpcName] = useState("Npc");
  const [userName, setUserName] = useState("User");
  const [facialData, setFacialData] = useState([])
  const [emotionData, setEmotionData] = useState([])
  const [gender, setGender] = useState("MALE");
  const [userEndOfResponse, setUserEndOfResponse] = useState(false);
  // Refs
  const npcTextRef = useRef();
  const convaiClient = useRef(null);
  const facialRef = useRef([])
  const finalizedUserText = useRef();

  //TimeStamps
  let keyPressTime = 100;
  const [keyPressTimeStamp, setKeyPressTimeStamp] = useState();





  //Intializing the convai Client
  useEffect(() => {
    convaiClient.current = new ConvaiClient({
      apiKey: apiKey,
      characterId: characterId,
      enableAudio: true, // use false for text only.
      faceModel: 3,
      enableFacialData: true,
    });

    convaiClient.current.setErrorCallback((type, message) => {
      console.log(type, message);
    })

    convaiClient.current.setResponseCallback((response) => {
      if (response.hasUserQuery()) {
        var transcript = response.getUserQuery();
        if (transcript.getIsFinal()) {
          finalizedUserText.current += " " + transcript.getTextData();
          transcript = "";
        }
        if (transcript) {
          setUserText(finalizedUserText.current + transcript.getTextData());
        } else {
          setUserText(finalizedUserText.current);
        }
      }
      if (response.hasAudioResponse()) {
        if (!response?.getAudioResponse()?.getEndOfResponse()) {
          let audioResponse = response?.getAudioResponse();

          if (audioResponse?.getVisemesData()?.array[0]) {
            let faceData = audioResponse?.getVisemesData().array[0];
            if (faceData[0] !== -2) {
              facialRef.current.push(faceData)
              setFacialData(facialRef.current)
            }
          }
          npcTextRef.current += " " + audioResponse.getTextData();
          setNpcText(npcTextRef.current);
          if (audioResponse) {
            setIsTalking(true);
          }
        }
        if (response.getAudioResponse()?.getEndOfResponse()) {
          setUserEndOfResponse(true);
        }

      }
    });

    const fetchData = async () => {
      try {
        const url = "https://api.convai.com/character/get";
        const payload = {
          charID: characterId,
        };
        const headers = {
          "CONVAI-API-KEY": apiKey,
          "Content-Type": "application/json",
        };

        const response = await axios.post(url, payload, { headers });

        if (avatar !== response.data.model_details.modelLink) {
          setAvatar(response.data.model_details.modelLink);
          setNpcName(response.data.character_name);
          setGender(response.data.voice_type);
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };

    fetchData();

    //Triggers when npc starts speaking
    convaiClient.current.onAudioPlay(() => {
      setAudioPlay(true);
    });

    //Triggers when npc stops speaking
    convaiClient.current.onAudioStop(() => {
      setAudioPlay(false);
      facialRef.current = [];
      setFacialData([]);
    });
  }, []);

  useEffect(() => {
    if (!audioPlay) {
      setIsTalking(false);
    }
  }, [audioPlay]);

  function handleKeyPress(e) {
    //To check whether the user is not inside the the input area
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA" ||
      document.activeElement.isContentEditable
    ) {
      // If the user is focused on an input field, return without activating the mic
      return;
    }
    if (convaiClient.current && e.keyCode === 84 && !keyPressed) {
      e.stopPropagation();
      e.preventDefault();
      setKeyPressed(true);
      finalizedUserText.current = "";
      npcTextRef.current = "";
      setUserText("");
      setNpcText("");
      convaiClient.current.startAudioChunk();
      // Record the timestamp of the key Pressed
      setKeyPressTimeStamp(Date.now())
    }
  }

  function handleKeyRelease(e) {
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA" ||
      document.activeElement.isContentEditable
    ) {
      // If the user is focused on an input field, return without activating the mic
      return;
    }
    if (convaiClient.current && e.keyCode === 84 && keyPressed) {
      e.preventDefault();
      const elapsedTime = Date.now() - keyPressTimeStamp;
      //if elapsedTime less then 100ms
      if (elapsedTime < keyPressTime) {
        setTimeout(() => {
          if (convaiClient.current && keyPressed) {
            setKeyPressed(false);
            convaiClient.current.endAudioChunk();
          }
        }, keyPressTime)
      } else {
        setKeyPressed(false);
        convaiClient.current.endAudioChunk();
      }

    }
  }

  //Sends user's message to the convai client
  function sendText() {
    if (convaiClient.current) {
      finalizedUserText.current = "";
      npcTextRef.current = "";
      setNpcText("");
      convaiClient.current.sendTextChunk(userText);
      setEnter(0);
    }
  }

  //Handles textBox messages
  useEffect(() => {
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA" ||
      document.activeElement.isContentEditable
    ) {
      if (userText !== "" && enter) {
        sendText();
      }
    }
  }, [enter]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [keyPressed]);

  const client = {
    convaiClient,
    npcText,
    userText,
    keyPressed,
    characterId,
    setEnter,
    setUserText,
    setNpcText,
    npcName,
    userName,
    gender,
    avatar,
    isTalking,
    facialData,
    emotionData,
    setEmotionData,
    userEndOfResponse,
    facialRef,
    setUserEndOfResponse
  };

  return { client };
}
