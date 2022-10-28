import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { PriceResponce } from '../../types';
import { ABI_chat, CHAIN, connectors } from '../const';
import { useModal } from './useModal';
import env from "react-dotenv";
import { Friend, LoginResp, Mex } from '../../types/types';

// import { useSetConnectModal } from './useConnectModalStore';
// import { useSetMintError, useSetMintErrorMessage, useSetMintLoading } from './useMintStore';
// import { useSetMintResponse } from './useMintStore';

export const useChat = () => {

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
        "0xc82Bc1237c0FB197FF56129C75E6aE433B0518Bc",
        ABI_chat,
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

    const userExist = async (address: string) => {
        let exist: boolean = await contract.checkUserExists(address);
        return exist
    }

    const getUserName = async (address: string) => {
        let username: string = await contract.getUsername(address);
        return username
    }

    const createAcc = async (username: string, address: string) => {
        let loginResp: LoginResp = { username: "", addr: "", showConnectButto: "" }
        try {
            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to send the message", true, false)
            const created: boolean = await contract.createAccount(username)
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
            if (created) {
                loginResp = { username: username, addr: address, showConnectButto: "none" }
                console.log({loginResp});
                
                return loginResp
            } else {
                loginResp = { username: "", addr: "", showConnectButto: "" }
                return loginResp
            }


        } catch (err: any) {
            hanlderMessage("error", "Error", err, false, false)
            loginResp = { username: "", addr: "", showConnectButto: "" }
            return loginResp
        }

    }

    const login = async (address: string) => {
        let loginResp: LoginResp = { username: "", addr: "", showConnectButto: "" }
        try {
            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to send the message", true, false)
            let present = await contract.checkUserExists(address);
            let username: string;
            console.log({present});
            if (present) {
                username = await contract.getUsername(address)
                console.log({username});
                
            } else {
                username = prompt("Enter a username", "Guest") as string;
                if (username === "") username = "Guest";
                const created: boolean = await contract.createAccount(username)
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
                if (created) {
                    loginResp = { username: username, addr: address, showConnectButto: "none" }
                    return loginResp
                } else {
                    loginResp = { username: "", addr: "", showConnectButto: "" }
                    return loginResp
                }
            }

        } catch (err: any) {
            hanlderMessage("error", "Error", err, false, false)
            loginResp = { username: "", addr: "", showConnectButto: "" }
            return loginResp
        }
    }

    const sendMessage = async (recieverAddress: string, data: string) => {

        try {
            hanlderMessage("info", "Loading wallet permission", "Please wait notification and complete the operation to send the message", true, false)
            let present = await contract.checkUserExists(recieverAddress);
            if (present) {
                const sumbitted: boolean = await contract.sendMessage(recieverAddress, data)
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
                return sumbitted
            } else {
                hanlderMessage("error", "Error", "Address not found: Ask them to join the app", false, false)
                return false
            }


        } catch (err: any) {
            hanlderMessage("error", "Error", err, false, false)
            return false
        }
    }

    const addChat = async (name: string, publicKey: string) => {
        let frnd: Friend = { name: "", pubkey: "" };
        console.log({ publicKey });
        console.log({ name });


        try {
            let present = await contract.checkUserExists(publicKey);
            console.log({ present });

            if (!present) {
                hanlderMessage("error", "Error", "Address not found", false, false)
                return frnd;
            }
            try {
                const added: boolean = await contract.addFriend(publicKey, name)
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
                if (added) {
                    frnd = { name: name, pubkey: publicKey };
                    return frnd
                } else {
                    return frnd
                }
            } catch (err) {
                hanlderMessage("error", "Error", "Friend already added!", false, false)
                return frnd
            }
        } catch (err: any) {
            console.log({ err });
            hanlderMessage("error", "Error", err, false, false)
            return frnd

        }
    }

    const loadFriends = async () => {
        let friendList: Friend[] = [];
        try {
            const data = await contract.getMyFriendList();
            data.forEach((item: Friend) => {
                friendList.push(item);
            });
            return friendList
        } catch (err) {
            return friendList = [];
        }
    }

    const getMessage = async (friendsPublicKey: string, friends: Friend[]) => {
        let nickname = "";
        let messages: Mex[] = [];
        let getMessageResp = { friendname: "", publicKey: "", messages: messages }
        friends.forEach((item: Friend) => {
            if (item.pubkey === friendsPublicKey) {
                nickname = item.name
            };
        });
        // Get messages
        try {
            const data = await contract.readMessage(friendsPublicKey);
            data.forEach((item: Mex) => {
                // const timestamp = new Date(1000 * item.[1].toNumber()).toUTCString();
                messages.push({
                    sender: item.sender,
                    timestamp: item.timestamp,
                    msg: item.msg,
                });
            });

            getMessageResp = { friendname: nickname, publicKey: friendsPublicKey, messages: messages }
            return getMessageResp

        } catch {
            return getMessageResp

        }
    }


    return {
        contract,
        contractGetMethod,
        correctChain,
        hanlderMessage,
        login,
        sendMessage,
        addChat,
        loadFriends,
        getMessage,
        userExist,
        createAcc,
        getUserName
    }

}

