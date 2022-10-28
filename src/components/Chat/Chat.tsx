import React, { createContext, useCallback, useMemo, useRef } from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import { ethers } from "ethers";
import abi from "./../../shared/abi/abiChat.json";
import { Message } from "./Message";
import { ChatCard } from "./ChatCard";
import { NavChat } from "./NavChat";
import { AddNewChat } from "./AddNewChat";
import { ActiveChat, Friend, LoginResp, Mex } from "../../types/types";
import { useWeb3React } from "@web3-react/core";
import { useChat } from "../../shared/hook/useChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'


// Add the contract address inside the quotes

export type ChatContextdefaultValue = {
    username: string
    friends: Friend[] | undefined
    activeChat: ActiveChat
    loadMex: (address: string) => void
    setActiveChat: (friend: Friend) => void
    userRegistered: boolean
}

const defaultValue: ChatContextdefaultValue = {
    username: "",
    friends: [],
    activeChat: {
        name: "",
        pubkey: "",
    },
    loadMex: (address: string) => { },
    setActiveChat: (friend: Friend) => { },
    userRegistered: false
}

export const ChatContext = createContext(defaultValue)

export const Chat = () => {
    const [friends, setFriends] = useState<Friend[]>();
    const { login, loadFriends, getMessage, sendMessage, userExist, getUserName } = useChat()
    const { account } = useWeb3React()
    const [myName, setMyName] = useState(null);
    const [myPublicKey, setMyPublicKey] = useState("");
    const [activeChat, setActiveChat] = useState({
        name: "",
        pubkey: "",
    });
    const [activeChatMessages, setActiveChatMessages] = useState<Mex[]>();
    const [showConnectButton, setShowConnectButton] = useState("block");
    const [myContract, setMyContract] = useState<any>();
    const [username, setUsername] = useState<string>("")
    const [userRegistered, setUserRegistered] = useState(false)

    const bottomRef = useRef<null | HTMLDivElement>(null); 

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [activeChatMessages]);
    
    const showMessages = useMemo(() => {
        if (activeChatMessages) {
            return (
                activeChatMessages.map((message: Mex, index) => {
                    let margin = "5%";
                    let sender = activeChat.name;
                    if (message.sender === account) {
                        margin = "15%";
                        sender = "You";
                    }
                    return (
                        <>
                            <Message 
                                key={index}
                                activeChat={activeChat}
                                message={message}
                            />
                            <div ref={bottomRef}> </div>
                        </>

                    )
                })
            )

        }
    }, [activeChatMessages])

    const showChat = useMemo(() => {
        if (friends && friends?.length > 0) {
            return friends.map((friend, index) => {
                return (
                    <ChatCard
                        key={index}
                        publicKey={friend.pubkey}
                        name={friend.name}
                        friend={friend}
                        onClick={
                            setActiveChat(friend)
                            // loadMex(friend.pubkey)

                        }
                    />
                )
            })

        } else {
            <p>NO chat yet</p>
        }
    }, [friends])

    const exist = async (account: string) => {
        const exist = await userExist(account)
        setUserRegistered(exist)
        console.log({ exist });

        if (exist) {
            const userName = await getUserName(account)
            setUsername(userName)
            console.log({ userName });
        }

    }


    useEffect(() => {
        if (account) {
            setActiveChatMessages([])
            loadFrineds()
            exist(account)
            // chatLogin(account)
        }
    }, [account])


    const chatLogin = async (account: string) => {
        const loggedUser = await login(account)
        setUsername(loggedUser?.username ?? "")
    }

    const loadFrineds = async () => {
        const fr = await loadFriends()
        console.log({ fr });
        setFriends(fr)
    }

    const loadMex = useCallback(
        async (friendAddr: string) => {
            console.log("loadmex", friendAddr)
            if (friends) {
                const mex = await getMessage(friendAddr, friends)
                setActiveChatMessages(mex.messages)
                console.log({ mex });
            }
        },
        [friends],
    )


    const handleSubmitText = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const message = (form[0] as HTMLInputElement).value
            console.log(activeChat.pubkey);
            console.log(message);

            if (!activeChat.pubkey || !message) {
                return
            }
            console.log(activeChat.pubkey);

            const sent = await sendMessage(activeChat.pubkey, message)
            if (sent) {
                console.log(sent)
                loadMex(activeChat.pubkey)
            }
        },
        [activeChat.pubkey],
    )

    return (
        <ChatContext.Provider value={{
            username: username,
            friends: friends,
            activeChat: activeChat,
            loadMex: loadMex,
            setActiveChat: setActiveChat,
            userRegistered: userRegistered
        }}>
            <Container style={{ zIndex: 2 }}>
                <NavChat className="w-100" />
                <div className="row h-100">
                    <div className="col-4 h-100">
                        <div className="d-flex flex-column bg-light justify-content-between" style={{ height: "60vh" }}>
                            <div className="flex-fill p-2">
                                {showChat}
                            </div>
                            <div>
                                <AddNewChat
                                />
                            </div>

                        </div>
                    </div>
                    <div className="col-8 h-100">
                        <div className="d-flex flex-column bg-light justify-content-between" style={{ height: "60vh" }}>
                            <div className="w-100 text-start p-2">
                                {activeChatMessages && activeChatMessages?.length > 0 && activeChat.name}
                            </div>

                            <div className="flex-fill p-2 overflow-auto">
                                {showMessages}
                            </div>
                            <div>

                                <Form
                                    onSubmit={(e) => {
                                        handleSubmitText(e)
                                    }}
                                    className="d-flex p-2 align-items-center"
                                >
                                    <Col xs={9}>
                                        <Form.Control
                                            required
                                            id="messageData"
                                            className="mb-2"
                                            placeholder="Send Message"
                                        />
                                    </Col>
                                    <Col>
                                        <Button
                                            className="mb-2 d-flex justify-content-center align-items-center"
                                            style={{ float: "right", height:"40px", width:"40px" }}
                                            type="submit"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </Button>
                                    </Col>
                                </Form>

                            </div>

                        </div>
                    </div>
                </div>


                {/* <Row>
                    <Col style={{ backgroundColor: "var(--white)" }}>
                        <Row className="flex-column align-content-between">
                            <Col className="">Chat</Col>
                            <Col className="">
                                chat
                            </Col>
                            <Col className="">
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={8}>
                        <div style={{ backgroundColor: "#DCDCDC", height: "100%" }}>
                            <Row style={{ marginRight: "0px" }}>
                                <Card
                                    style={{
                                        width: "100%",
                                        alignSelf: "center",
                                        margin: "0 0 5px 15px",
                                    }}
                                >
                                    <Card.Header>
                                        {activeChat.friendname} : {activeChat.publicKey}
                                        <Button
                                            style={{ float: "right" }}
                                            variant="warning"
                                            onClick={() => {
                                                if (activeChat && activeChat.publicKey)
                                                    getMessage(activeChat.publicKey);
                                            }}
                                        >
                                            Refresh
                                        </Button>
                                    </Card.Header>
                                </Card>
                            </Row>
                            <div
                                className="MessageBox"
                                style={{ height: "400px", overflowY: "auto" }}
                            >
                                {Messages}
                            </div>
                            
                        </div>
                    </Col>
                </Row> */}
            </Container>
        </ChatContext.Provider>
    );
}


