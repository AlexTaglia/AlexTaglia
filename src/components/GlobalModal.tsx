import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaMandalorian } from 'react-icons/fa';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';

export const GlobalModal = (props: any) => {
  const { callSetLogoutIsOpen, modal, callSetModal, callSetResetModal } = useModal()
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
          {modal.generalModal?.isLoading &&
            <span
              className="spinner-border me-2"
              role="status"
              style={{ color: "var(--primary)", verticalAlign: "", width: "1.2rem", height: "1.2rem", borderWidth: "0.1rem" }}>
            </span>}
          {modal.generalModal?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <p>
          {modal.generalModal?.description}
        </p>

        {!modal.generalModal?.isLoading &&
          <Button className="mb-2" variant="primary" onClick={() => {
            callSetResetModal()
          }}> OK</Button>
        }

      </Modal.Body>
    </Modal >
  );
}


