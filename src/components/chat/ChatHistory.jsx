import React from "react";
import { useState } from "react";
import logo from "../../assets/ConvaiLogo.png";
import "../../index.css";
import ThumbsUp_fill from "../../assets/Thumbsup_fill.png";
import Thumbsdown_fill from "../../assets/Thumbsdown_fill.png";
import Thumbsup_outline from "../../assets/Thumbsup_outline.png";
import Thumbsdownoutline from "../../assets/Thumbsdownoutline.png";
import { PiClockClockwiseBold } from "react-icons/pi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const ChatHistory = (props) => {
  const { history, showHistory, messages, npcName, userName } = props;
  const [feedbacks, setFeedbacks] = useState(Array(messages?.length).fill(0));
  return (
    <section>
      <div className={history ? "chat-Historyo" : "chat-Historyc"}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position:"relative"
          }}
        >
     
          {history ? (
            <img
            loading="lazy"
              style={{ paddingRight: "20px", marginTop: "0.9vh" }}
              src={logo}
              height="30px"
              width="100px"
              alt="convai chat history logo"
            ></img>
          ) : (
            ""
          )}
        </div>
        {!history ? (
          <PiClockClockwiseBold
            onClick={showHistory}
            style={{
              color: "white",
              position: "absolute",
              left: "0.3vw",
              top: "3.5vw",
              fontSize: "1.7vw",
              cursor: "pointer",
            }}
          ></PiClockClockwiseBold>
        ) : (
          <MdKeyboardDoubleArrowLeft
            onClick={showHistory}
            style={{
              color: "white",
              position: "absolute",
              left: "0.3vw",
              top: "3.5vw",
              fontSize: "2vw",
              cursor: "pointer",
            }}
          ></MdKeyboardDoubleArrowLeft>
        )}
        <div
          className="container-chat1"
          style={{
            width: "95%",
            height: "80%",
            overflow: "auto",
            marginBottom: "15px",
            marginTop: "15px",
            marginLeft: "20px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages?.map((message, idx) => {

            const isUserMessage = message.sender === "user";
            const nextMessage = messages[idx + 1];
            const isNextMessageUser =
              !nextMessage || nextMessage.sender === "user";
            const isNextMessageNpc =
              !nextMessage || nextMessage.sender === "npc";

            const messageStyle = {
              color: "#FFFFFF",
              paddingLeft: "10px",
              // marginBottom: isNextMessageUser ? "0px" : 0,
            };

            return (
              <section key={idx}>
                {message.sender === "user" && isNextMessageNpc && history
                  ? message.content && (
                      <div style={{ marginBottom: "2px" }}>
                        <span
                          style={{
                            color: "rgba(243,167,158,255)",
                            marginRight: "-5px",
                            fontWeight: "bold",
                          }}
                        >
                          {userName}:
                        </span>
                        <span style={messageStyle}>{message.content}</span>
                      </div>
                    )
                  : message.sender === "npc" && isNextMessageUser && history
                  ? message.content && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color: "rgba(127,210,118,255)",
                              marginRight: "-10px",
                              fontWeight: "bold",
                            }}
                          >
                            {npcName}:
                          </span>
                          <span style={messageStyle}>{message.content}</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            marginLeft: "7px",
                            marginRight: "20px",
                          }}
                        >
                          <img
            loading="lazy"
            
                            style={{ paddingRight: "10px" }}
                            src={
                              feedbacks[idx] === 1
                                ?  ThumbsUp_fill 
                                :  Thumbsup_outline 
                            }
                            alt="convai chat history feedback filled"
                            height="17px"
                            onClick={() => {
                              const newFeedbacks = [...feedbacks];
                              newFeedbacks[idx] = feedbacks[idx] === 1 ? 0 : 1;
                              setFeedbacks(newFeedbacks);
                            }}
                          ></img>
                          <img
            loading="lazy"
                            src={
                              feedbacks[idx] === 2
                                ?  Thumbsdown_fill 
                                :  Thumbsdownoutline 
                            }
                            alt="convai chat history filled"
                            height="17px"
                            onClick={() => {
                              const newFeedbacks = [...feedbacks];
                              newFeedbacks[idx] = feedbacks[idx] === 2 ? 0 : 2;
                              setFeedbacks(newFeedbacks);
                            }}
                          ></img>
                        </div>
                      </div>
                    )
                  : ""}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChatHistory;
