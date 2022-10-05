import { useWeb3React } from "@web3-react/core";
import { Network, Alchemy, OwnedNftsResponse, Nft, NftContract, NftContractNftsResponse } from "alchemy-sdk";
import { useCallback, useMemo, useState } from "react";
import { ComputeRarity, FloorPriceData } from "../../types/types";
import env from "react-dotenv";

export const useAlchemy = () => {

    // https://docs.alchemy.com/reference/nft-api-endpoints
    // https://docs.alchemyapi.io/guides/rate-limits

    const [ownedNftsResponse, setOwnedNftsResponse] = useState<OwnedNftsResponse>()
    const [NFTMetadataResponse, setNFTMetadataResponse] = useState<Nft>()
    const [contractMetadataResponse, setContractMetadataResponse] = useState<NftContract>()
    const [NFTsForCollectionResponse, setNFTsForCollectionResponse] = useState<NftContractNftsResponse>()
    const [computeRarity, setComputeRarity] = useState<ComputeRarity[]>()
    const [floorPriceData, setFloorPriceData] = useState<FloorPriceData>()


    const [loadingGetNftsForOwner, setLoadingGetNftsForOwner] = useState(true)
    const [loadingGetNFTMetadata, setLoadingGetNFTMetadata] = useState(true)
    const [loadingGetContractMetadata, setLoadingGetContractMetadata] = useState(false)
    const [loadingGetNFTsForCollection, setLoadingGetNFTsForCollection] = useState(true)
    const [loadingGetComputeRarity, setLoadingGetComputeRarity] = useState(false)
    const [loadingGetFloorPrice, setLoadingGetFloorPrice] = useState(false)

    const settings = {
        apiKey: env.APIKEY,
        network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(settings);


    // Gets all NFTs currently owned by a given address.
    const optionGetNftsForOwner = useMemo(() => {
        const option = {
            pageKey: ownedNftsResponse?.pageKey,
            pageSize: 10,
            // contractAddresses: ["0x96274FBaa302550Df96fcaEC0883BdAB5e9eB0E1", "0x98382C7BADDaAd4c2151864BB8cbbA5Cc2E23974"] //Max limit 20 contracts.
        }
        return option

    }, [ownedNftsResponse?.pageKey])

    const getNftsForOwner = useCallback(
        async (account: string) => {
            setLoadingGetNftsForOwner(true)
            await alchemy.nft
                .getNftsForOwner(account, optionGetNftsForOwner)
                .then((res: OwnedNftsResponse) => {
                    setOwnedNftsResponse(res)
                    setLoadingGetNftsForOwner(false)
                    console.log({res})
                })
                .catch((err) => {
                    setLoadingGetNftsForOwner(false)
                    console.error({ err })
                });
        },
        [optionGetNftsForOwner]
    )

    //Gets the metadata associated with a given NFT.
    const getNFTMetadata = async (contractAddresses: string, tokenId: string) => {
        setLoadingGetNFTMetadata(true)
        await alchemy.nft
            .getNftMetadata(contractAddresses, tokenId)
            .then((res: Nft) => {
                setNFTMetadataResponse(res)
                setLoadingGetNFTMetadata(false)
            })
            .catch((err) => {
                setLoadingGetNFTMetadata(false)
                console.error({ err })
            });
    }

    //Queries NFT high-level collection/contract level information.
    // non funziona su rinkeby
    const getContractMetadata = async (contractAddresses: string) => {

        setLoadingGetContractMetadata(true)
        await alchemy.nft
            .getContractMetadata(contractAddresses)
            .then((res: NftContract) => {
                setContractMetadataResponse(res)
                setLoadingGetContractMetadata(false)
            })
            .catch((err) => {
                setLoadingGetContractMetadata(false)
                console.error({ err })
            });
    }

    //Gets all NFTs for a given NFT contract.
    // non funziona su rinkeby
    const getNftsForContract = async (contractAddresses: string) => {
        setLoadingGetNFTsForCollection(true)
        await alchemy.nft
            .getNftsForContract(contractAddresses)
            .then((res: NftContractNftsResponse) => {
                setNFTsForCollectionResponse(res)
                setLoadingGetNFTsForCollection(false)
            })
            .catch((err) => {
                setLoadingGetNFTsForCollection(false)
                console.error({ err })
            });
    }

    //Gets all NFTs for a given NFT contract.
    // non funziona su rinkeby
    const refreshContract = async (contractAddresses: string) => {
        await alchemy.nft
            .refreshContract(contractAddresses)
            .then((res) => {
                console.log("OwnedNftsResponse", { res })
            })
            .catch((err) => {
                console.error({ err })
            });
    }

    const options = { method: 'GET', headers: { accept: 'application/json' } };

    const getComputeRarity = async (contractAddresses: string, tokenId: string) => {
        setLoadingGetComputeRarity(true)
        fetch('https://eth-mainnet.g.alchemy.com/nft/v2/demo/computeRarity?contractAddress=0x8d64528676e437dc27a4ffe88a80141053c5e6f6&tokenId=5030', options)

        await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/${settings.apiKey}/computeRarity?contractAddress=${contractAddresses}&tokenId=${tokenId}`, options)
            .then(response => response.json())
            .then((response) => {
                setLoadingGetComputeRarity(false)
                setComputeRarity(response)
            })
            .catch(err => {
                console.error(err)
                setComputeRarity([])
                setLoadingGetComputeRarity(false)
            }
            );
    }

    const getFloorPrice = async (contractAddresses: string) => {
        setLoadingGetFloorPrice(true)

        await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/demo/getFloorPrice?contractAddress=${contractAddresses}`, options)
            .then(response => response.json())
            .then((response) => {
                setFloorPriceData(response)
                setLoadingGetFloorPrice(false)
            })
            .catch(err => {
                // setFloorPriceData()
                setLoadingGetFloorPrice(false)
                console.error(err)
            });
    }


    return {
        alchemy,
        getNftsForOwner,
        ownedNftsResponse,
        loadingGetNftsForOwner,
        getNFTMetadata,
        NFTMetadataResponse,
        loadingGetContractMetadata,
        getContractMetadata,
        contractMetadataResponse,
        loadingGetNFTMetadata,
        getNftsForContract,
        NFTsForCollectionResponse,
        loadingGetNFTsForCollection,
        refreshContract,
        getComputeRarity,
        loadingGetComputeRarity,
        computeRarity,
        getFloorPrice,
        loadingGetFloorPrice,
        floorPriceData
    }

}