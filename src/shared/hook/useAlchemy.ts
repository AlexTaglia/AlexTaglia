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
        apiKey: env.REACT_APP_APIKEY,
        network: Network.ETH_GOERLI,
    };
    const alchemy = new Alchemy(settings);


    // Gets all NFTs currently owned by a given address.
    const optionGetNftsForOwnerCreated = useMemo(() => {
        const option = {
            pageKey: ownedNftsResponse?.pageKey,
            pageSize: 10,
            contractAddresses: ["0x0214Ed70Cb7b67Dc1Cd03F540cBF15ae3805e242"] //Max limit 20 contracts.
        }
        return option
    }, [ownedNftsResponse?.pageKey])

    const optionGetNftsForOwnerCollected = useMemo(() => {
        const option = {
            pageKey: ownedNftsResponse?.pageKey,
            pageSize: 10,
            contractAddresses: [] 

        }
        return option
    }, [ownedNftsResponse?.pageKey])

    const getNftsForOwner = useCallback(
        async (account: string, collected:boolean, created:boolean) => {
            setLoadingGetNftsForOwner(true)

            let option =  optionGetNftsForOwnerCreated

            if(collected){
                option = optionGetNftsForOwnerCollected
            }

            await alchemy.nft
                .getNftsForOwner(account, option)
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
        [optionGetNftsForOwnerCreated, optionGetNftsForOwnerCollected]
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

        await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/demo/computeRarity?contractAddress=${contractAddresses}&tokenId=${tokenId}`, options)
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

    const getBalances = useCallback(
        async (account: string) => {
            await alchemy.core
                .getTokenBalances(account, ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"])
                .then((res: any) => {
                    console.log({res})
                    console.log(res.tokenBalances[0].tokenBalance/1e18)
                })
                .catch((err) => {
                    console.error({ err })
                });
        },
        []
    )


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
        floorPriceData,
        getBalances
    }

}