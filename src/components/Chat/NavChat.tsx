import { useWeb3React } from "@web3-react/core";
import React, { useContext, useMemo } from "react";
import { Button, Navbar } from "react-bootstrap";
import { useChat } from "../../shared/hook/useChat";
import { useModal } from "../../shared/hook/useModal";
import { ChatContext } from "./Chat";

export const NavChat = (props: any) => {
  const { login } = useChat()
  const { account } = useWeb3React()

  const ctx = useContext(ChatContext)
  const {callSetConnectIsOpen} = useModal()

  const showButton = useMemo(() => {
    if (!ctx.userRegistered && account) {
      return (<Button
        onClick={() => login(account)}>
        Register
      </Button>)
    } else if(ctx.username && account) {
      return (<Button style={{cursor:"inherit"}}>
        {ctx.username}
      </Button>)
    } else {
      return (<Button
        onClick={() => callSetConnectIsOpen(true)}>
        connect your wallet
      </Button>)
    }

  }, [account, ctx.userRegistered, ctx.username])

  return (
    <Navbar className="ps-2 pe-2" bg="dark" variant="dark" style={{ marginTop: "100px" }}>
      <Navbar.Brand href="#home"> WhatsEth </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {showButton}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}