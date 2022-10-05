import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { ABI, CHAIN, connectors } from '../const';
import { useModal } from './useModal';
// import { useSetConnectModal } from './useConnectModalStore';
// import { useSetMintError, useSetMintErrorMessage, useSetMintLoading } from './useMintStore';
// import { useSetMintResponse } from './useMintStore';

export const useChain = () => {

    const { activate, deactivate, active, account, library, chainId } = useWeb3React();
    const [correctChain, setCorrectChain] = useState(false)
    const { callSetConnectIsOpen, callSetModal } = useModal()

    // const { callSetMintErrorMessage } = useSetMintErrorMessage()
    // const { callSetMintError } = useSetMintError()
    // const { callSetConnectModal } = useSetConnectModal()
    // const { callSetMintResponse } = useSetMintResponse()
    // const { callSetMintLoading } = useSetMintLoading()

    const w = window as any
    const ethereum = w.ethereum

    let signer = library?.getSigner();

    const contract = new ethers.Contract(
        CHAIN.contract,
        ABI,
        signer
    );


    useEffect(() => {
        if (chainId === CHAIN.chainId) {
            setCorrectChain(true)
        }
    }, [chainId])

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const logout = (external?: boolean) => {
        if (external) {
            if (window.confirm("You are going to logout")) {
            deactivate()
            localStorage.clear()
            }
        } else {
            deactivate()
            localStorage.clear()
        }
    }

    const hanlderMessage = (messageType: string, messageTitle: string, messageDescription: string, disconnectWallet: boolean) => {
        console.log({ type: messageType, title: messageTitle, description: messageDescription, disconnectWallet: disconnectWallet })
        { disconnectWallet && logout() }

        callSetModal({
            modalIsOpen: true,
            type: messageType,
            title: messageTitle,
            description: messageDescription
        })
    }

    const switchNetwork = async () => {
        try {
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: CHAIN.metamaskParams.chainId }]
            })
        } catch (switchError: any) {
            deactivate()
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [CHAIN.metamaskParams]
                    });
                } catch (error) {
                    hanlderMessage("error", "Error", "Please add correct chain to your wallet", true)
                    callSetConnectIsOpen(false)
                    deactivate()
                    localStorage.clear()
                }
            } else {
                hanlderMessage("error", "Error", switchError.message, true)
                callSetConnectIsOpen(false)

            }
        }
    };

    const getActualChainId = () => {
        if (ethereum && ethereum.isMetaMask && ethereum?.networkVersion) {
            return ethereum?.networkVersion
        }
    }

    const connectWallet = async (connector: AbstractConnector, type: string, props?: any, isStepper?: boolean) => {
        if (connector) {
            try {
                if (connector instanceof InjectedConnector) {
                    if (!ethereum) {
                        hanlderMessage("error", "Error", "Please install Metamask extension", true)
                        callSetConnectIsOpen(false)
                        return
                    }

                    if (ethereum && ethereum.isMetaMask) {

                        await switchNetwork()

                        if (ethereum.setSelectedProvider) {

                            let provIsMetaMask = ethereum.providers?.find((p: any) => p.isMetaMask)
                            ethereum.setSelectedProvider(provIsMetaMask)
                            await switchNetwork()
                        }

                        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                            await switchNetwork()
                        }

                    } else {
                        hanlderMessage("error", "Error", "Please install Metamask extension", true)
                        callSetConnectIsOpen(false)
                        return
                    }
                }

                if (connector instanceof WalletLinkConnector &&

                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    await switchNetwork()
                }

                activate(connector,
                    (error: Error) => {
                        if (error.name === "UnsupportedChainIdError") {
                            deactivate()
                            localStorage.clear()
                            return
                        }
                        hanlderMessage("error", "Error", error.message, true)
                        callSetConnectIsOpen(false)
                        return

                    }, true)
                    .then(() => {
                        setProviderLS(type)
                        { props && isStepper && props.nextStep() }
                        callSetConnectIsOpen(false)
                        return
                    })
                    .catch(error => {

                        if (error.name === "UnsupportedChainIdError") {
                            hanlderMessage("error", "Error", `Unsupported chain, please change network to ${CHAIN.metamaskParams.chainName}`, true)
                            
                            deactivate()
                            localStorage.clear()
                            return
                        }
                        
                        hanlderMessage("error", "Error", error.message, true)
                        callSetConnectIsOpen(false)
                        return
                    })

            } catch (error: any) {
                callSetConnectIsOpen(false)
                hanlderMessage("error", "Error", error.message, true)
                return
            }
        }
    }

    const setProviderLS = (type: any) => {
        window.localStorage.setItem("provider", type);
    };

    const reconnect = () => {
        if (!active && !account) {
            let provider = window.localStorage.getItem("provider");
            { provider === "InjectedConnector" && connectWallet(connectors.injected, "InjectedConnector") }
            { provider === "WalletConnectConnector" && connectWallet(connectors.walletConnect, "WalletConnectConnector") }
            { provider === "WalletLinkConnector" && connectWallet(connectors.coinbaseWallet, "WalletLinkConnector") }
        }
    }

    const contractMethod = async <T>(method: (account?: string) => T, name: string, account?: string) => {
        try {
            let data
            if (account) {
                data = await method(account)
            } else {
                data = await method()
            }
            return data
        } catch (error: any) {
            // console.error({error})
            hanlderMessage("error", name, error.message, false)
        }
    }

    const mint = async (price: string, qty: number, uri: string, props?: any) => {
        try {
            // callSetMintLoading(true)
            { props && props.nextStep() }

            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to continue", false)
            await contract.mint(`${qty}`, `${uri}`, { value: `${price}` })
                .then(async (nftTxn: any) => {

                    nftTxn.wait();
                    hanlderMessage("info", "Waiting blockchain", "Wait for the operations on blockchain to complete.", false)
                    await library.waitForTransaction(nftTxn.hash);
                    const receipt = await library.getTransactionReceipt(nftTxn.hash);

                    if (receipt.status === 1) {
                        // console.log("success")

                        { props && props.nextStep() }

                        return true
                    } else {
                        // console.log("Something went wrong")

                        hanlderMessage("error", "Error", "Something went wrong.", false)

                        return false
                    }
                }).catch((error: any) => {
                    // console.error({ error })
                    const errorMessage = error?.data?.message ?? error?.reason ?? error?.message;
                    const isTooLowGas = error?.message?.toLowerCase().includes('transaction underpriced');
                    const description = isTooLowGas ? 'Your gas fee are too low, set to high to ensure the transaction confirmation' : errorMessage

                    // callSetMintResponse(false);
                    hanlderMessage("error", "Error", description, false)

                    return false
                })


        } catch (error: any) {
            // console.error({error})
            // callSetMintResponse(false);
            hanlderMessage("error", "Error", error.message, false)
            return
        }
    }


    return { connectWallet, reconnect, getActualChainId, logout, contract, contractMethod, correctChain, mint, hanlderMessage }

}

