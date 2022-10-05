import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import abi from './abi/abi.json';
import { toHex } from "../shared/utils/Formatters";
// TO DO INSERIRE I LINK
import env from "react-dotenv";

export const OPENSEA = "https://opensea.io/account"


// CHAIN

export const ABI = abi;

export const INFURA_KEY = env.REACT_APP_INFURA_KEY

const CHAIN_MAINNET_ID: number = 1;
const CHAIN_TESTNET_ID: number = 4;
export const MAX_FILE_SIZE:number = 103809024; //99MB


const AVAILABLE_CHAINS = {
    mainnet: {
        chainId: CHAIN_MAINNET_ID,
        contract: env.REACT_APP_CONTRACT,
        metamaskParams: {
            chainId: toHex(CHAIN_MAINNET_ID),
            chainName: 'Ethereum Mainnet',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io']
        }
    },
    testnet: {
        chainId: CHAIN_TESTNET_ID,
        contract: env.REACT_APP_CONTRACT,
        metamaskParams: {
            chainId: toHex(CHAIN_TESTNET_ID),
            chainName: 'Rinkeby Testnet',
            nativeCurrency: {
                name: 'RinkebyETH',
                symbol: 'RinkebyETH',
                decimals: 18
            },
            rpcUrls: ['https://Rinkeby.infura.io/v3/'],
            blockExplorerUrls: ['https://Rinkeby.etherscan.io']
        }
    }
}
//!!!!! TODO Cambiare solo questo in AVAILABLE_CHAINS.mainnet
export const CHAIN = AVAILABLE_CHAINS.mainnet
//!!!!!

export const CHAIN_ID = CHAIN.chainId
export const CHAIN_RPC = CHAIN.metamaskParams.rpcUrls[0]

//Metamask
const injectedConnector = new InjectedConnector({
    supportedChainIds: [CHAIN_ID]
});

//Walletconnect
const walletConnectConnector = new WalletConnectConnector({
    rpc: { [CHAIN_ID]: CHAIN_RPC + INFURA_KEY }, 
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    chainId: CHAIN_ID,
});

//coinbase
const coinbaseConnector = new WalletLinkConnector({
    url: CHAIN_RPC + INFURA_KEY,
    appName: "Monza Meta Circuit",
    supportedChainIds: [-1, CHAIN_ID],
    darkMode: true
});



export const connectors = {
    injected: injectedConnector,
    walletConnect: walletConnectConnector,
    coinbaseWallet: coinbaseConnector,
};