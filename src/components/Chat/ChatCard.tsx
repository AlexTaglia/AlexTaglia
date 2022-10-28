import React, { useContext, useEffect, useState } from "react";
import { Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './ChatCard.css'
import { ChatContext } from "./Chat";
import { displayFormat, formatTimestamp } from "../../shared/utils/Formatters"
import { Mex } from "../../types/types";
import { useChat } from "../../shared/hook/useChat";

// This is a function which renders the friends in the friends list
export const ChatCard = (props: any) => {

  const ctx = useContext(ChatContext)
  console.log(props.publicKey)
  const [currentChatMessages, setCurrentChatMessages] = useState<Mex>();
  const [dt, setDt] = useState<string>();
  const { getMessage } = useChat()

  useEffect(() => {
    loadMex(props.publicKey)
  }, [ctx.friends])


  const loadMex = async (friendAddr: string) => {
    if (ctx.friends) {
      console.log("loadmex", friendAddr)
      const mex = await getMessage(friendAddr, ctx.friends)
      const time = mex.messages[mex.messages.length -1].timestamp
      setDt(formatTimestamp(time, true))
      setCurrentChatMessages(mex.messages[mex.messages.length -1])
    }
  }


  return (
    <div onClick={() => {
      ctx.loadMex(props.publicKey);
      ctx.setActiveChat(props.friend)
    }}
      className="chat-card text-start p-2">
      <div className="d-flex justify-content-between">
        <div className="name">{props.name}</div>
        <div className="addr">{dt}</div>
      </div>
      {/* <p className="addr">{displayFormat(props.publicKey)}</p> */}
      <p className="addr">{currentChatMessages?.msg}</p>

    </div>
    // <Row>
    //   <Card
    //     border="success"
    //     style={{ width: "100%", alignSelf: "center"}}
    //     onClick={() => {
    //       props.getMessages(props.publicKey);
    //     }}
    //   >
    //     <Card.Body>
    //       <Card.Title> {props.name} </Card.Title>
    //       <Card.Subtitle>
    //         {" "}
    //         {props.publicKey.length > 20
    //           ? props.publicKey.substring(0, 20) + " ..."
    //           : props.publicKey}{" "}
    //       </Card.Subtitle>
    //     </Card.Body>
    //   </Card>
    // </Row>
  );
}