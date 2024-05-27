import '../../index.css';
import React from 'react';
import { useState } from 'react';
import logo from '../../assets/ConvaiLogo.png';
import ThumbsUp_fill from '../../assets/Thumbsup_fill.png';
import Thumbsdown_fill from '../../assets/Thumbsdown_fill.png';
import Thumbsup_outline from '../../assets/Thumbsup_outline.png';
import Thumbsdownoutline from '../../assets/Thumbsdownoutline.png';

const ChatBubblev1 = (props) => {
  var { userText, npcText, keyPressed } = props;
  const [feedback, setFeedback] = useState(0);

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <section
        className="container"
        style={{
          position: 'absolute',
          top: '82vh',
          left: '2.5vw',
          width: '92vw',
          height: '120px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
        }}
      >
        <section
          className="container-chat"
          style={{
            borderRadius: '10px',
            marginBottom: '15px',
            marginTop: '25px',
          }}
        >
          {/* {console.log("keypressed", keyPressed)} */}
          {keyPressed && (
            <div className="icon">
              <span className="span-prop" />
              <span className="span-prop" />
              <span className="span-prop" />
            </div>
          )}
          {userText === '' ? (
            <p
              style={{
                maxHeight: '300px',
                width: '100%',
                color: 'rgba(219,168,66,255)',
                marginTop: '25px',
                marginLeft: '20px',
                marginRight: '15px',
              }}
            >
              Press [T] to talk
            </p>
          ) : (
            // <form style={{ width: "100%" }}>
            //   <input
            //     className="placeholder3"
            //     style={{
            //       backgroundColor: "rgba(0, 0, 0, 0.01)",
            //       borderWidth: "0px",
            //       // position: "absolute",
            //       width: "95%",
            //       marginLeft: "20px",
            //       marginTop: "30px",
            //       color: "white",
            //       // borderStyle: "solid",
            //       // borderWidth: "2px",
            //       // borderColor: "red",
            //     }}
            //     placeholder="Press [Space] to talk or type your responses here"
            //     type="text"
            //   />
            // </form>
            <div style={{ width: '100%' }}>
              <p
                style={{
                  maxHeight: '300px',
                  width: '95%',
                  color: '#FFFFFF',
                  paddingLeft: '20px',
                  marginBottom: '-10px',
                  marginTop: '10px',
                }}
              >
                {userText}
              </p>
              <p
                style={{
                  maxHeight: '38px',
                  width: '95%',
                  color: '#39FF14',
                  paddingLeft: '20px',
                }}
              >
                {npcText}
              </p>
            </div>
          )}
          {userText === '' ? (
            ''
          ) : (
            <div
              className="item-review"
              style={{
                display: 'flex',
                marginLeft: '10px',
                marginTop: '25px',
              }}
            >
              <img
            // loading="lazy"
                style={{ marginRight: '10px', cursor: 'pointer' }}
                src={feedback === 1 ? ThumbsUp_fill :  Thumbsup_outline }
                alt="feedback chat"
                height="20px"
                onClick={
                  feedback === 1 ? () => setFeedback(0) : () => setFeedback(1)
                }
              ></img>
              <img
            // loading="lazy"
                style={{ cursor: 'pointer' }}
                src={
                  feedback === 2 ?  Thumbsdown_fill  :  Thumbsdownoutline 
                }
                alt="feedback chat filled"
                height="20px"
                onClick={
                  feedback === 2 ? () => setFeedback(0) : () => setFeedback(2)
                }
              ></img>
            </div>
          )}
          <div
            style={{
              marginLeft: '10px',
              marginRight: '20px',
              marginTop: '20px',
            }}
          >
            <img
            
            loading="lazy"
            src={logo} height="30px" width="100px" alt="Convai chat logo"></img>
          </div>
        </section>
      </section>
    </div>
  );
};

export default ChatBubblev1;
