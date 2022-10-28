import React, { useRef } from "react";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useChat } from "../../shared/hook/useChat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'


// This Modal help Add a new friend
export const AddNewChat = (props: any) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const inputAddressRef = useRef(null);
  const inputNameRef = useRef(null);
  const { addChat } = useChat();

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const address = (form[0] as HTMLInputElement).value
    const name = (form[1] as HTMLInputElement).value
    const friend = await addChat(name, address)
    console.log({ friend })
  }

  return (
    <div
      className="AddNewChat"
    // style={{
    //   position: "absolute",
    //   bottom: "100px",
    //   padding: "10px 45px 0 45px",
    //   margin: "0 95px 0 0",
    //   width: "97%",
    // }}
    >
      <Button
        variant="primary"
        className="mb-2 d-flex justify-content-center align-items-center "
        style={{ height: "40px", width: "40px" }}
        onClick={handleShow}>
        <FontAwesomeIcon icon={faAdd} />
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title> Add New Friend </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitHandler} >

            <Form.Group>
              <Form.Control
                required
                id="addPublicKey"
                type="text"
                placeholder="Enter friend address"
              />
              <br />
              <Form.Control
                required
                id="addName"
                type="text"
                placeholder="Name"
              />
              <br />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
            >
              Add Friend
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}