import React, { useState, useEffect } from 'react';
// import { getWeb3, getWallet} from './utils'
import { NewTransfer } from './NewTransfer';
import { TransferList } from './TransferList';
import { Header } from './Header';
import { Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { useMultisig } from '../../shared/hook/useMultisig';
import { Transfer } from '../../types/types';
// import {Buffer} from 'buffer';
// Buffer.from('anything','base64');

export const Multisig = () => {
  const { account } = useWeb3React()
  const { getApprovers, getQuorum, getTransfers } = useMultisig()

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  const [approvers, setApprovers] = useState<string[]>();
  const [quorum, setQuorum] = useState<number>();

  const [transfers, setTransfers] = useState<Transfer[]>()


  // useEffect(() => {
  //   const init = async () => {
  //     // const wallet = await getWallet(web3);
  //     // const approvers = await wallet.methods.getApprovers().call();
  //     // const quorum = await wallet.methods.quorum().call();
  //     // const transfers = await wallet.methods.getTransfers().call()

  //     setWeb3(web3);
  //     setAccounts(accounts);
  //     setWallet(wallet);
  //     setTransfers(transfers);

  //   }
  //   init()
  // }, [])

  const init = async () => {
    console.log("init")
    try {
      const approvers = await getApprovers()
      const quorum = await getQuorum()
      const transfers = await getTransfers()
      setApprovers(approvers);
      setQuorum(parseInt(quorum.toString()));
      setTransfers(transfers)
    } catch (error) {
      console.error("init", { error })
    }
  }

  useEffect(() => {
    if (account) {
      init()
    }
  }, [account])


  const createTransfer = (transfer: any) => {
    // console.log("createTransfer")
    // wallet.methods
    // .createTransfer(transfer.amount, transfer.to)
    // .send({from:accounts[0]})
  }

  const approveTransfer = (transferId: number) => {
    // console.log("approveTransfer")
    // wallet.methods.approveTransfer(transferId)
    // .send({from:accounts[0]})
  }

  // if (
  //   typeof web3 === undefined
  //   || typeof accounts === undefined
  //   || typeof wallet === undefined
  //   || typeof quorum === undefined
  //   || approvers.length === 0) {
  //   return <div>Loading</div>
  // }

  return (
    <Container className='text-white d-flex justify-content-center' style={{ marginTop: "110px", height: "calc(100vh - 110px)", zIndex: 1 }}>
      <div className='col-12 col-md-8 col-lg-6 p-2 text-start'>
        <div className='d-flex justify-content-center'>
          <h1 className=' mb-5 text-start d-flex flex-wrap'>Multisig wallet</h1>
        </div>
        <Header approvers={approvers ?? []} quorum={quorum} />
        <hr />
        <NewTransfer createTransfer={createTransfer} />
        <hr />
        <TransferList transfers={transfers ?? []} approveTransfer={approveTransfer} />
      </div>
    </Container>
  );
}
