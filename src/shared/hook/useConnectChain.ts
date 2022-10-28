import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { PriceResponce } from '../../types';
import { ABI, CHAIN, connectors } from '../const';
import { useModal } from './useModal';
// import { useSetConnectModal } from './useConnectModalStore';
// import { useSetMintError, useSetMintErrorMessage, useSetMintLoading } from './useMintStore';
// import { useSetMintResponse } from './useMintStore';

export const useChain = () => {

    const { activate, deactivate, active, account, library, chainId } = useWeb3React();
    const [correctChain, setCorrectChain] = useState(false)
    const { callSetConnectIsOpen, callSetModal, callSetResetModal } = useModal()
    const [balance, setBalance] = useState<number>(0)
    const [ensName, setEnsName] = useState<string>("")

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

    const hanlderMessage = (messageType: string, messageTitle: string, messageDescription: string, isLoading: boolean, disconnectWallet: boolean) => {
        console.debug({ type: messageType, title: messageTitle, description: messageDescription, disconnectWallet: disconnectWallet })
        { disconnectWallet && logout() }
        callSetConnectIsOpen(false)
        callSetModal({
            modalIsOpen: true,
            type: messageType,
            title: messageTitle,
            description: messageDescription,
            isLoading: isLoading
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
                    console.error({ error });
                    hanlderMessage("error", "Error", "Please add correct chain to your wallet", false, true)
                    deactivate()
                    localStorage.clear()
                }
            } else {
                hanlderMessage("error", "Error", switchError.message, false, true)
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
                        hanlderMessage("error", "Error", "Please install Metamask extension", false, true)
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
                        hanlderMessage("error", "Error", "Please install Metamask extension", false, true)
                        return
                    }
                }

                if (connector instanceof WalletLinkConnector &&
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    // await switchNetwork() //-> non funziona su app coinbase wallet
                }

                activate(connector, (error: Error) => {
                    if (error.name === "UnsupportedChainIdError") {
                        hanlderMessage("error", "Error", `Unsupported chain, please change network to ${CHAIN.metamaskParams.chainName}`, false, true)
                        deactivate()
                        localStorage.clear()
                        return
                    } else {
                        hanlderMessage("error", "Error", error.message, false, true)
                        return
                    }

                }, true)
                    .then(() => {
                        setProviderLS(type)
                        { props && isStepper && props.nextStep() }
                        callSetConnectIsOpen(false)
                        return
                    })
                    .catch(error => {
                        if (error.name === "UnsupportedChainIdError") {
                            hanlderMessage("error", "Error", `Unsupported chain, please change network to ${CHAIN.metamaskParams.chainName}`, false, true)
                            return
                        } else if (error.code === -32002) {
                            hanlderMessage("info", "Info", `Already processing the connection. Please check your wallet`, false, true)
                            return
                        } else {
                            if (error.message.includes("Unsupported chain")) {
                                hanlderMessage("error", "Error", `Unsupported chain, please change network to ${CHAIN.metamaskParams.chainName}`, false, true)
                            } else {
                                hanlderMessage("error", "Error", error.message, false, true)
                                return
                            }
                        }
                    })

            } catch (error: any) {
                hanlderMessage("error", "Error", error.message, false, true)
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

    const contractGetMethod = async <T>(method: (account?: string) => T, name: string, account?: string) => {
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
            hanlderMessage("error", name, error.message, false, false)
        }
    }

    const handleTnx = async (txn: any) => {
        txn.wait();

        hanlderMessage("info", "Waiting blockchain", "Wait for the operations on blockchain to complete.", true, false)
        await library.waitForTransaction(txn.hash);
        const receipt = await library.getTransactionReceipt(txn.hash);

        if (receipt.status === 1) {
            // console.log("receipt.status === 1")
            hanlderMessage("info", "Minting Complete", "Congratulation!.", false, false)
            return true

        } else {
            // console.log("receipt.status !== 1")
            hanlderMessage("error", "Error", "Something went wrong.", false, false)
            return false
        }
    }


    const mint = async (price: string, qty: number, uri: string) => {
        try {
            // callSetMintLoading(true)

            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to continue", true, false)
            const minted: boolean = await contract.mint(`${qty}`, `${uri}`, { value: `${price}` })
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
            return minted


        } catch (error: any) {
            hanlderMessage("error", "Error", error.message, false, false)
            return false
        }
    }

    // convert address to ens
    const ensToAddr = async (address: string) => {
        try {
            const name = await library.lookupAddress(address);
            setEnsName(name)
        } catch (error) {
            setEnsName("")
        }
    }

    const getBalance = (account: string) => {
        library?.getBalance(account).then((result: number) => {
            const res = result / 1e18
            setBalance(res)
        })
    }

    const price = useCallback(
        async () => {
            // await sleep(600);
            if (account) {
                let p: PriceResponce = {
                    price: "",
                    formatPrice: ""
                }
                try {
                    p.price = await contract.cost()
                    p.formatPrice = ethers.utils.formatEther(p.price)
                    return p
                } catch (error: any) {
                    // console.log("loading price", { error })
                    hanlderMessage("error", "Error loading price", error.message, false, false)
                    return p
                }
            }
        }, [account],
    )

    useEffect(() => {
        { account && ensToAddr(account) }
        { account && getBalance(account) }
    }, [account])


    const iswitelisted = async (account:string) => {
        const isWitelisted: boolean = await contract.isWhitelisted(account)
        return isWitelisted
    }

    return {
        connectWallet,
        reconnect,
        getActualChainId,
        logout,
        contract,
        contractGetMethod,
        correctChain,
        mint,
        hanlderMessage,
        ensToAddr,
        balance,
        getBalance,
        ensName,
        price,
        iswitelisted
    }

}

