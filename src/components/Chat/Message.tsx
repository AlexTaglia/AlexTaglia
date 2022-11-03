import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Row, Card } from "react-bootstrap";
import { formatTimestamp } from "../../shared/utils/Formatters";
import { ActiveChat, Mex } from "../../types/types";
import './Message.css'

interface MessageProps {
  activeChat: ActiveChat
  message: Mex
}

// This is a functional component which renders the individual messages
export const Message = (p: MessageProps) => {
  
  const [senderName, setSenderName] = useState("")
  const { account } = useWeb3React()

  useEffect(() => {
    let sender = p.activeChat.name;
    if (p.message.sender === account) {
      sender = "You";
    }
    setSenderName(sender)
  }, [p.activeChat, p.message])


  return (
    <div className={senderName === "You" ? "d-flex justify-content-end mb-2 message-container " : "d-flex justify-content-start mb-2 message-container"}>
      <div style={{ width: "auto", minWidth:"40%", maxWidth:"70%"}} 
      className={senderName === "You" ? "bg-darkc text-white rounded text-end p-2" : "bg-secondary text-white rounded text-start p-2"}>
        <p className="date mb-0">{formatTimestamp(p.message.timestamp, false)}</p>
        <p className="text mb-1">{p.message.msg}</p>
      </div>
    </div>
    // <Row style={{ marginRight: "0px" }}>
    //   <Card
    //     border="success"
    //     style={{
    //       width: "60%",
    //       alignSelf: "center",
    //       margin: "0 0 5px " + props.marginLeft,
    //       float: "right",
    //       right: "0px",
    //     }}
    //   >
    //     <Card.Body>
    //       <h6 style={{ float: "right" }}>{date.toLocaleDateString() + " " + formattedTime}</h6>
    //       <Card.Subtitle>
    //         <b>{props.sender}</b>
    //       </Card.Subtitle>
    //       <Card.Text>{props.data}</Card.Text>
    //     </Card.Body>
    //   </Card>
    // </Row>
  );
}