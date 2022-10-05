import React, { useCallback, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'reactjs-popup/dist/index.css';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import { Metadata } from './types';
import env from "react-dotenv";
import { useChain } from './shared/hook/useConnectChain';
import { connectors } from './shared/const';
import { Button, Card, Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { ConnectWallet } from './components/ConnectWallet';
import { useModal } from './shared/hook/useModal';
import { useAlchemy } from './shared/hook/useAlchemy';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OwnedNft } from 'alchemy-sdk';
import { Navbarg } from './components/Navbar';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { MyCollection } from './components/MyCollection';
import { Mint } from './components/Mint';
import { LogOutModal } from './components/LogoutModal';
import { GlobalModal } from './components/GlobalModal';




function App() {

  const { reconnect } = useChain()
  const { account } = useWeb3React()
  const { getNftsForOwner, ownedNftsResponse, getNFTMetadata, refreshContract } = useAlchemy()
  const [items, setItems] = useState<OwnedNft[]>([])
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()


  useEffect(() => {
    reconnect()
  }, [])

  return (
    <Container fluid className="App" style={{ overflowY: "auto" }}>
      <BrowserRouter>
        <Navbarg />
        <Routes>
          {/* <Route path="/" element={<App />}> */}
          <Route path="/mycollection" element={<MyCollection />} />
          {/* <Route path="/mint" element={<Mint />} /> */}
          {/* <Route path="teams" element={<Teams />}>
                <Route path=":teamId" element={<Team />} />
                <Route path="new" element={<NewTeamForm />} />
                <Route index element={<LeagueStandings />} />
              </Route> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>

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
