import React, { createContext, useEffect, useState } from 'react';
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
import { PriceResponce } from './types';
import { Chat } from './components/Chat/Chat';
import { MintFormik } from './components/MintFormik';
import { Multisig } from './components/Multisig/Multisig';

const defaultValue = {
  price: "",
  priceHex: "",
}

export const ChainDataContext = createContext(defaultValue)

function App() {

  const { reconnect, getBalance, price } = useChain()
  const { account, library } = useWeb3React()
  const { getNftsForOwner, ownedNftsResponse, getNFTMetadata, refreshContract, getBalances } = useAlchemy()
  const [items, setItems] = useState<OwnedNft[]>([])
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen, callSetResetModal } = useModal()
  const [cost, setCost] = useState("")
  const [costHex, setCostHex] = useState("")

  useEffect(() => {
    reconnect()
  }, [])

  const getPrice = async () => {
    let p = await price()
    setCost(p?.formatPrice ?? "")
    setCostHex(p?.price.toString() ?? "")
    console.log(p?.price.toString());
    console.log(p?.formatPrice);
    
  }

  useEffect(() => {
    { account && getBalance(account) }
    { account && getPrice() }
  }, [account])

  const Router = env.REACT_APP_IPFS === "true" ? HashRouter : BrowserRouter

  return (
    <ChainDataContext.Provider value={{
      price: cost,
      priceHex: costHex
    }}>
      <Container fluid className="App" style={{ overflowY: "auto"}}>
        <ParticlesCustom />
        <Router>
          <Navbarg />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collected" element={<MyCollection collected={true} created={false} />} />
            <Route path="/created" element={<MyCollection collected={false} created={true}/>} />
            <Route path="/create" element={<MintFormik />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/multisig" element={<Multisig />} />
            {/* <Route path="teams" element={<Teams />}>
                <Route path=":teamId" element={<Team />} />
                <Route path="new" element={<NewTeamForm />} />
                <Route index element={<LeagueStandings />} />
              </Route> */}
            {/* </Route> */}
          </Routes>
          <Footer />
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
          onHide={() => callSetResetModal()}
        />



        {/* </Container> */}
      </Container>
    </ChainDataContext.Provider>

  );
}

export default App;
