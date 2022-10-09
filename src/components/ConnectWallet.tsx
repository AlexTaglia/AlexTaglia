import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors, metamaskLink } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import useMediaQuery from '../shared/hook/useMediaQuery';
import { useModal } from '../shared/hook/useModal';

export const ConnectWallet = (props: any) => {
  const { connectWallet } = useChain()
  const { modal } = useModal()
  const isMobile = useMediaQuery(950)
  const {callSetModal, callSetConnectIsOpen} = useModal()

  const w = window as any

  const redirect = () => {
    window.location.href = metamaskLink;
  }

  const handleCoinbase = () =>{
    // if (isMobile) {
    //   callSetConnectIsOpen(false)
    //   callSetModal({
    //     modalIsOpen: true,
    //     type: "info",
    //     title: "Coinbase wallet",
    //     description: "The wallet connection in temporary out of service"
    // })
    // } else {
    //   connectWallet(connectors.coinbaseWallet, "WalletLinkConnector")
    // }
    connectWallet(connectors.coinbaseWallet, "WalletLinkConnector")



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
          Connect your wallet
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">

        <Button className="mb-2" variant="primary" onClick={() => {

          if (isMobile && !w.ethereum) {
            redirect()
          } else {
            connectWallet(connectors.injected, "InjectedConnector")
          }


        }}>Metamask</Button>
        <Button className="mb-2" variant="primary" onClick={() => { connectWallet(connectors.walletConnect, "WalletConnectConnector") }}>Wallet Connect</Button>
        <Button className="mb-2" variant="primary" onClick={() => { handleCoinbase() }}>Coinbase </Button>

      </Modal.Body>
    </Modal>
  );
}


