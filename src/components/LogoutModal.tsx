import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';

export const LogOutModal = (props: any) => {
  const { callSetLogoutIsOpen } = useModal()
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
          Logout
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <p>
          You are going to logout
        </p>

        <Button className="mb-2" variant="primary" onClick={() => { callSetLogoutIsOpen(false) }}>CANCEL</Button>
        <Button className="mb-2" variant="primary" onClick={() => { logOut() }}>YES</Button>

      </Modal.Body>
    </Modal>
  );
}


