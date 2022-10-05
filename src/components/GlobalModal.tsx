import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';

export const GlobalModal = (props: any) => {
  const { callSetLogoutIsOpen, modal, callSetModal } = useModal()
  const { logout } = useChain()
  const logOut = () => {
    logout()
    callSetLogoutIsOpen(false)
  }

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modal.generalModal.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <p>
          {modal.generalModal.description}
        </p>

        <Button className="mb-2" variant="primary" onClick={() => {
          callSetModal({
            modalIsOpen: false,
            type: "",
            title: "",
            description: ""
          })
        }}> OK</Button>

      </Modal.Body>
    </Modal >
  );
}


