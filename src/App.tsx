import React, { useEffect, useState } from 'react';
import './App.css';
import 'reactjs-popup/dist/index.css';
import { useChain } from './shared/hook/useConnectChain';
import { Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { ConnectWallet } from './components/ConnectWallet';
import { useModal } from './shared/hook/useModal';
import { useAlchemy } from './shared/hook/useAlchemy';
import { OwnedNft } from 'alchemy-sdk';
import { Navbarg } from './components/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import { MyCollection } from './components/MyCollection';
import { Mint } from './components/Mint';
import { LogOutModal } from './components/LogoutModal';
import { GlobalModal } from './components/GlobalModal';
import { ParticlesCustom } from './components/Particles';
import { Home } from './components/Home';
import { Footer } from './components/Footer';
import env from 'react-dotenv';
 
function App() {

  const { reconnect, getBalance } = useChain()
  const { account, library } = useWeb3React()
  const { getNftsForOwner, ownedNftsResponse, getNFTMetadata, refreshContract, getBalances } = useAlchemy()
  const [items, setItems] = useState<OwnedNft[]>([])
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()


  useEffect(() => {
    reconnect()
  }, [])

  
  useEffect(() => {
    {account && getBalance(account)}
  }, [account])

  const Router = env.REACT_APP_IPFS ===  "true" ? HashRouter : BrowserRouter

  return (
    <Container fluid className="App" style={{ overflowY: "auto", paddingRight:"0" }}>
      <ParticlesCustom />
      <Router>
        <Navbarg />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/mycollection" element={<MyCollection />} />
          <Route path="/mint" element={<Mint />} />
          {/* <Route path="teams" element={<Teams />}>
                <Route path=":teamId" element={<Team />} />
                <Route path="new" element={<NewTeamForm />} />
                <Route index element={<LeagueStandings />} />
              </Route> */}
          {/* </Route> */}
        </Routes>
        <Footer/>
      </Router>

      {/* <Container> */}
      <ConnectWallet
        show={modal.walletModal.connectIsOpen}
        onHide={() => callSetConnectIsOpen(false)}
      />

      <LogOutModal
        show={modal.walletModal.logoutIsOpen}
        onHide={() => callSetLogoutIsOpen(false)}
      />

      <GlobalModal
        show={modal.generalModal.modalIsOpen}
        onHide={() => callSetModal({
          modalIsOpen: false,
          type: "",
          title: "",
          description: ""
        })}
      />



      {/* </Container> */}
    </Container>

  );
}

export default App;
