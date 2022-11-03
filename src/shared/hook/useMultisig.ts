import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { PriceResponce } from '../../types';
import { ABI_multisig, CHAIN, connectors } from '../const';
import { useModal } from './useModal';
import env from "react-dotenv";
import { Friend, LoginResp, Mex, Transfer } from '../../types/types';

// import { useSetConnectModal } from './useConnectModalStore';
// import { useSetMintError, useSetMintErrorMessage, useSetMintLoading } from './useMintStore';
// import { useSetMintResponse } from './useMintStore';

export const useMultisig = () => {

    const { activate, deactivate, active, account, library, chainId } = useWeb3React();
    const [correctChain, setCorrectChain] = useState(false)
    const { callSetConnectIsOpen, callSetModal, callSetResetModal } = useModal()

    // const { callSetMintErrorMessage } = useSetMintErrorMessage()
    // const { callSetMintError } = useSetMintError()
    // const { callSetConnectModal } = useSetConnectModal()
    // const { callSetMintResponse } = useSetMintResponse()
    // const { callSetMintLoading } = useSetMintLoading()

    const w = window as any
    const ethereum = w.ethereum

    let signer = library?.getSigner();

    const contract = new ethers.Contract(
        "0x79791C66222143D99993c1BaE10435cb74759506",
        ABI_multisig,
        signer
    );


    useEffect(() => {
        if (chainId === CHAIN.chainId) {
            setCorrectChain(true)
        }
    }, [chainId])


    const hanlderMessage = (messageType: string, messageTitle: string, messageDescription: string, isLoading: boolean, disconnectWallet: boolean) => {
        
        console.debug({ type: messageType, title: messageTitle, description: messageDescription, disconnectWallet: disconnectWallet })
        callSetConnectIsOpen(false)
        callSetModal({
            modalIsOpen: true,
            type: messageType,
            title: messageTitle,
            description: messageDescription,
            isLoading: isLoading
        })
    }

    const   handleTnx = async (txn: any) => {
        txn.wait();

        hanlderMessage("info", "Waiting blockchain", "Wait for the operations on blockchain to complete.", true, false)
        await library.waitForTransaction(txn.hash);
        const receipt = await library.getTransactionReceipt(txn.hash);

        if (receipt.status === 1) {
            // console.log("receipt.status === 1")
            callSetModal({
                modalIsOpen: false,
                type: "",
                title: "",
                description: "",
                isLoading: false
            })
            return true

        } else {
            // console.log("receipt.status !== 1")
            hanlderMessage("error", "Error", "Something went wrong.", false, false)
            return false
        }
    }

    const getApprovers = async () => {
        let approvers: string[] = await contract.getApprovers();
        return approvers
    }

    const getQuorum = async () => {
        let quorum: number = await contract.quorum();
        return quorum
    }

    const getTransfers = async () => {
        let transfer: Transfer[] = await contract.getTransfers();
        return transfer
    }

    const createTransfer = async (amount: number, address: string) => {
        console.log("create transfer");
        console.log({amount}, {address});
        
        // const am = ethers.utils.formatEther(amount.toString())
        // console.log({am});
        
        
        try {
            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to send the message", true, false)
            const transferCreated: boolean = await contract.createTransfer(amount.toString(), address)
                .then(async (nftTxn: any) => {
                    return await handleTnx(nftTxn)

                }).catch((error: any) => {
                    // console.error({ error })
                    const errorMessage = error?.data?.message ?? error?.reason ?? error?.message;
                    const isTooLowGas = error?.message?.toLowerCase().includes('transaction underpriced');
                    const description = isTooLowGas ? 'Your gas fee are too low, set to high to ensure the transaction confirmation' : errorMessage

                    // callSetMintResponse(false);
                    hanlderMessage("error", "Error", description, false, false)
                    return false
                })
            
                return transferCreated
        
        } catch (err: any) {
            hanlderMessage("error", "Error", err, false, false)
            return false
        }

    }



    return {
        contract,
        correctChain,
        hanlderMessage,
        getApprovers,
        getQuorum,
        getTransfers,
        createTransfer
    }

}

