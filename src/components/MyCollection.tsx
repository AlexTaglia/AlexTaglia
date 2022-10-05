import React, { useCallback, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import env from "react-dotenv";
import { Accordion, Button, Card, Container, Modal } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OwnedNft } from 'alchemy-sdk';
import { useModal } from '../shared/hook/useModal';
import { useAlchemy } from '../shared/hook/useAlchemy';
import Popup from 'reactjs-popup';
import ContentLoader from 'react-content-loader';
import { displayFormat } from '../shared/utils/Formatters';


export const MyCollection = () => {

  const { account } = useWeb3React()
  const {
    getNftsForOwner,
    getComputeRarity,
    getContractMetadata,
    getFloorPrice,
    ownedNftsResponse,
    computeRarity,
    contractMetadataResponse,
    loadingGetContractMetadata,
    loadingGetComputeRarity,
    floorPriceData
  } = useAlchemy()
  const [items, setItems] = useState<OwnedNft[]>([])
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()
  const [detailIsOpen, setDetailIsOpen] = useState(false)
  const [currentItem, setCurrentItmem] = useState<OwnedNft>()
  const [mediaLoaded, setMediaLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (account) {
      getNftsForOwner(account)
    }
  }, [account])

  useEffect(() => {
    if (floorPriceData) {
      console.log({ floorPriceData });
    }
  }, [floorPriceData])

  useEffect(() => {
    if (ownedNftsResponse && ownedNftsResponse?.ownedNfts) {
      console.log("items.length", items.length);
      if (items.length < ownedNftsResponse?.totalCount) {
        console.log("totalCount", ownedNftsResponse?.totalCount)
        console.log("items.length", items.length);


        let ownedNftsInit: OwnedNft[]

        if (items.length === 0) {
          ownedNftsInit = []
        } else {
          ownedNftsInit = items
        }

        const ownedNftsToAdd: OwnedNft[] = ownedNftsResponse?.ownedNfts
        const ownedNfts = [...items, ...ownedNftsToAdd]
        setItems(ownedNfts)
      }

    }
  }, [ownedNftsResponse, items])

  useEffect(()=>{
    console.log({items});
  },[items])

  const openDetail = (item: OwnedNft) => {
    setDetailIsOpen(true)
    getComputeRarity(item.contract.address, item.tokenId)
    getContractMetadata(item.contract.address)
    setCurrentItmem(item)
    getFloorPrice(item.contract.address)
  }

  const onLoad = () => {
    setMediaLoaded(true)
  }

  const showTraits = useMemo(() => {

    if (loadingGetComputeRarity) {   
      return <div className="spinner-border text-secondary" role="status"></div>
    }

    if (!loadingGetComputeRarity && computeRarity && computeRarity?.length > 0) {
      
      return computeRarity.map((trait, index) => {
        return (
          <div key={index} className='col-4 text-center mb-2'>
            <div className='m-1 border rounded h-100'>
              <p className='m-0 p-0'><strong>{trait.trait_type}</strong></p>
              <p className='m-0 p-0'>{trait.value}</p>
              <p className='m-0 p-0'>{trait.prevalence && (trait.prevalence * 100).toFixed(2)}%</p>
            </div>
          </div>
        )
      })
    } else if (!loadingGetComputeRarity && ownedNftsResponse && computeRarity?.length === 0) {

      const currentNft = ownedNftsResponse?.ownedNfts.find((item) => item.tokenId === currentItem?.tokenId && item.contract === currentItem.contract)      
      return currentNft?.rawMetadata?.attributes?.map((trait) => {
        let value = trait.value

        if (trait.value && trait.display_type === "date") {
          value = new Date(trait.value)
          value = value.toLocaleString('en-GB', { timeZone: 'UTC' });
        }
        console.log({value}, trait.trait_type, );
        

        return (
          <div key={trait.value + trait.trait_type} className='col-4 text-center mb-2'>
            <div className='m-1 border rounded h-100'>
              <p className='m-0 p-0'><strong>{trait.trait_type}</strong></p>
              <p className='m-0 p-0'>{value}</p>
            </div>
          </div>
        )
      })
    }
  }, [computeRarity, currentItem, loadingGetComputeRarity, ownedNftsResponse, detailIsOpen])

  const showCards = useMemo(() => {
    if (items) {
      return items.map((item, index) => {
        return (
          <Card onClick={() => openDetail(item)} style={{ width: '18rem', cursor:'pointer'}} className="zoom mb-4 bg-dark text-white" key={item.contract.address + item.tokenId + index}>
            {!mediaLoaded &&
              <ContentLoader
                viewBox="0 0 800 800"
                backgroundColor="#212529"
                foregroundColor="#282c34"
              >
                <rect x="0" y="0" rx="20" ry="20" width="100%" height="100%" />
              </ContentLoader>
            }
            {item.rawMetadata?.animation_url ?
              <video controls className={mediaLoaded ? "rounded" : "d-none"} onLoad={() => onLoad()} loop src={item.rawMetadata?.animation_url?.replace("ipfs://", "https://ipfs.io/ipfs/")}></video> :
              <Card.Img className={mediaLoaded ? "rounded" : "d-none"} onLoad={() => onLoad()} variant="top" src={item?.media[0]?.gateway} />
            }
            <Card.Body>
              <Card.Title>{item.title ? item.title : `Item: ${item.tokenId}`}</Card.Title>
              <Card.Text>
                {/* {item.balance} */}
                {/* {item.title} */}
                {/* {item?.description} */}
                {/* {item?.contract.address} */}
              </Card.Text>
            </Card.Body>
          </Card>)
      });
    }
  }, [ownedNftsResponse, items, mediaLoaded, contractMetadataResponse])

  const showInfiniteScroll = useMemo(() => {
    
    if (ownedNftsResponse?.totalCount){
      console.log("ownedNftsResponse?.totalCount", ownedNftsResponse?.totalCount);
      console.log("items", items);
      return (<InfiniteScroll
        dataLength={items.length}
        next={() => account && getNftsForOwner(account)}
        hasMore={items.length < ownedNftsResponse?.totalCount}
        loader={<h4 style={{ color: "white" }}>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b style={{ color: "white" }}>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className='d-flex flex-wrap justify-content-around mt-2'>
          {showCards}
        </div>
      </InfiniteScroll>)
    }
  }, [ownedNftsResponse?.totalCount, items, account, mediaLoaded, contractMetadataResponse, getNftsForOwner])

  const showFloorPrices = useMemo(() => {
    
    if (floorPriceData) {
      return Object.keys(floorPriceData).map((key) => {
      // return Object.keys(floorPriceData).filter((key)=>key.toLowerCase() === "opensea").map((key) => {
        let x = floorPriceData[key];
        return (
          <div key={key} className='d-flex justify-content-between'>
            <a className='text-dark' href={x.collectionUrl} target={'_blank'}> {key}</a>
            <div>{x.floorPrice} {x.priceCurrency}</div>
          </div>
        )
      })
    }
  }, [floorPriceData])

  return (
    <Container style={{ marginTop: "110px", height: "calc(100vh - 110px)" }} >
      {showInfiniteScroll}

      <Modal
        scrollable
        show={detailIsOpen}
        onHide={() => setDetailIsOpen(false)}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered


      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter "> {loadingGetContractMetadata ?
            <div className="spinner-border text-secondary" role="status"></div>
            :
            contractMetadataResponse?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row flex-wrap">
          <div className='col-12 col-lg-6 '>
            {currentItem?.rawMetadata?.animation_url ?
              <video className={mediaLoaded ? "w-100 rounded" : "d-none"} onLoad={() => onLoad()} autoPlay loop src={currentItem?.rawMetadata?.animation_url?.replace("ipfs://", "https://ipfs.io/ipfs/")}></video> :
              <Card.Img className={mediaLoaded ? "w-100 rounded" : "d-none"} onLoad={() => onLoad()} variant="top" src={currentItem?.media[0]?.gateway} />
            }
          </div>

          <div className='col-12 col-lg-6 overflow-auto mt-3 mt-md-0' >
            <h3>{currentItem?.title ? currentItem?.title : `Item: ${currentItem?.tokenId}`}</h3>
            <div className=''>
              <Accordion className='w-100 '>
                <Accordion.Item eventKey="0">
                  <Accordion.Header style={{ backgroundColor: "none" }} >Floor price:</Accordion.Header>
                  <Accordion.Body className=''>
                    {showFloorPrices}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              { currentItem?.description &&
                <Accordion className='w-100 mt-3'>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header style={{ backgroundColor: "none" }} >Description:</Accordion.Header>
                    <Accordion.Body className=''>
                      {currentItem?.description}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              }

              <Accordion className='w-100 mt-3'>
                <Accordion.Item eventKey="2">
                  <Accordion.Header style={{ backgroundColor: "none" }} >Details:</Accordion.Header>
                  <Accordion.Body className=''>
                    <div className='d-flex justify-content-between'>
                      <div>Contract Address:</div>
                      <a target={"_blank"} className='text-dark' href={`https://etherscan.io/address/${contractMetadataResponse?.address}`}>{contractMetadataResponse && displayFormat(contractMetadataResponse?.address)}</a>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <div>Name :</div>
                      <div>{contractMetadataResponse?.name}</div>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <div>Symbol:</div>
                      <div>{contractMetadataResponse?.symbol}</div>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <div>Token Standard:</div>
                      <div>{contractMetadataResponse?.tokenType}</div>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <div>Total supply:</div>
                      <div>{contractMetadataResponse?.totalSupply}</div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion className='w-100 mt-3'>
              <Accordion.Item eventKey="3">
                <Accordion.Header style={{ backgroundColor: "none" }} >Properties</Accordion.Header>
                <Accordion.Body>
                  <div className='d-flex flex-wrap'>
                    {showTraits}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            </div>

          </div>

        </Modal.Body>
      </Modal>
    </Container>
  );
}
