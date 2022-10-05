import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';

export const ConnectWallet = (props: any) => {
  const { connectWallet } = useChain()
  const {modal} = useModal()

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Connect your wallet
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">

        <Button className="mb-2" variant="primary" onClick={() => { connectWallet(connectors.injected, "InjectedConnector") }}>Metamask</Button>
        <Button className="mb-2" variant="primary" onClick={() => { connectWallet(connectors.walletConnect, "WalletConnectConnector") }}>Wallet Connect</Button>
        <Button className="mb-2" variant="primary" onClick={() => { connectWallet(connectors.coinbaseWallet, "WalletLinkConnector") }}>Coinbase </Button>

      </Modal.Body>
    </Modal>
  );
}


