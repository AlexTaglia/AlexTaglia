import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import env from "react-dotenv";
import { Accordion, Button, Card, Container, Form, Table } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { OwnedNft } from 'alchemy-sdk';
import { useChain } from '../shared/hook/useConnectChain';
import { useAlchemy } from '../shared/hook/useAlchemy';
import { useModal } from '../shared/hook/useModal';
import { Metadata } from '../types';
import { AssetFile } from '../types/types';
import { cleanString, filetypeIsAllowed, filetypeIsImage, filetypeIsVideo } from '../shared/utils/fileUtils';
import { MAX_FILE_SIZE } from '../shared/const';
import { UploadFileComponent } from './UploadFileComponent';
import "./Mint.css"

interface Props {
  trait_type: string;
  value: string;
}

export const Mint = () => {

  const projectId = env.REACT_APP_PROJECT_ID;
  const projectSecret = env.REACT_APP_PROJECT_SECRET;
  const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

  const { account } = useWeb3React()
  const { mint, hanlderMessage } = useChain()
  const { } = useAlchemy()
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()

  const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<AssetFile>();
  const [itemName, setItemName] = useState("");
  const [validFileSize, setValidFileSize] = useState(true)
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [selectedImagePreviewFile, setSelectedImagePreviewFile] = useState<AssetFile>();
  const [validImagePreviewFileSize, setValidImagePreviewFileSize] = useState(true)
  const [inputList, setInputList] = useState<Props[]>([{ trait_type: "", value: "" }]);
  const [propList, setPropList] = useState<Props[]>([{ trait_type: "", value: "" }]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(true)
  const [selectedImageHome, setSelectedImageHome] = useState<any>()
  const [selectedchain, setSelectedChain] = useState<string>("0x1")




  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error("IPFS error ", { error });
    alert("IPFS error:" + error);
    ipfs = undefined;
  }

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const chain = (form[0] as HTMLInputElement).value;
    const name = (form[2] as HTMLInputElement).value;
    const description = (form[3] as HTMLInputElement).value;
    const externaLink = (form[4] as HTMLInputElement).value;
    const contractType = (form[4] as HTMLInputElement).value;
    const qTy = (form[4] as HTMLInputElement).value;
    setSelectedChain(chain)

    console.log({ chain });
    console.log({ name });
    console.log({ description });
    console.log({ externaLink });
    console.log({ contractType });
    console.log({ qTy });



    // // Carico il file su IPFS e creo i metadati
    // const metadata: Metadata = await uploadFileToIpfs(selectedImageHome, description, name, externaLink)
    // console.log(metadata)

    // // Carico i metadati su IPFS e mi ritorna l'has
    // const hash = await uploadMetadataToIpfs(metadata)
    // console.log(hash)

    // //Con l'hash miinto il mio NFT
    // try {
    //   await mint("1000000000000000", 1, `ipfs://${hash}`)
    // } catch (error) {
    //   console.error({ error })
    //   throw error
    // }

    // //reset
    // setPropList([{ trait_type: "", value: "" }])
    // form.reset();
  };

  const uploadFileToIpfs = async (file: File, description: string, name: string, externaLink: string) => {
    let metadata: Metadata

    try {
      hanlderMessage("info", "Uploading to ipfs", "Please wait, uploading the image to ipfs in progress ", false)
      const result = await (ipfs as IPFSHTTPClient).add(file);
      metadata = {
        "description": description,
        "image": `ipfs://${result.path}`,
        "name": name,
        "attributes": propList,
        "external_url": externaLink,
        // "animation_url": "",
        // "background_color": "",
      }

    } catch (error) {
      hanlderMessage("error", "Uploading to ipfs", "Error during uploading of the file to IPFS", false)
      console.error({ error })
      throw error
    }

    return metadata
  }

  const uploadMetadataToIpfs = async (metadata: Metadata) => {
    let hash: string

    try {
      hanlderMessage("info", "Uploading to ipfs", "Please wait, uploading of the matadata to ipfs in progress", false)
      const result = await (ipfs as IPFSHTTPClient).add(JSON.stringify(metadata));
      hash = result.path
    } catch (error) {
      hanlderMessage("error", "uploadMetadataToIpfs", "Error during uploading of the metadata to IPFS", false)
      console.error({ error })
      throw error
    }

    return hash
  }

  //setta l'input delle props
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[i][name as keyof Props] = cleanString(value, true);
    setInputList(list);
  };

  //Aggiunge una nuova riga di prop
  const addNewProp = () => {
    setInputList([...inputList, { trait_type: "", value: "" }]);
  };

  //Cancella una riga di prop
  const removeProp = (index: number) => {
    if (inputList.length === 0) {
      setInputList([{ trait_type: "", value: "" }]);
    }
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  //Salva le prop
  const saveProps = () => {
    const res1 = inputList.filter(o => Object.values(o.trait_type).every(v => v) && Object.entries(o.trait_type).length);
    const res2 = res1.filter(o => Object.values(o.value).every(v => v) && Object.values(o.value).length);
    if (res2.length === 0) {
      setPropList([{ trait_type: "", value: "" }]);
      setInputList([{ trait_type: "", value: "" }]);
    } else {
      setPropList(res2);
      setInputList(res2);
    }
  }


  return (
    <Container style={{ marginTop: "110px", height: "calc(100vh - 110px)" }}>
      {!ipfs && (
        <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
      )}

      {ipfs && (
        <>

          <Form onSubmit={onSubmitHandler}>
            <div className='d-flex justify-content-center'>
              <div className='col-sm-12 col-md-8 col-lg-6 p-2 text-start'>
                <h1 className='text-white mb-5 text-start'>Create New Item</h1>
                <h6 className='text-white mb-4'><span className='text-danger'>*</span> Required fields</h6>
                <Form.Group className="mb-3 text-light" controlId="formSelect">
                  <Form.Label>Blockchain<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                  <Form.Select aria-label="Default select" onChange={(e) => setSelectedChain(e.target.value)}>
                    <option selected value="0x1">Ethereum</option>
                    <option value="0x81">Polygon</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3 text-light" controlId="formImage">
                  <Form.Label>Image<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                  <UploadFileComponent
                    dimensioni="800x750px"
                    file={selectedImageHome}
                    fileType={".jpeg, .jpg, .gif, .png"}
                    callback={setSelectedImageHome}
                    label=""
                  />
                  {/* <Form.Control
                    className="form-control"
                    required
                    name="file"
                    type="file"
                    accept=".png,.jpeg,.jpg,.gif"
                    // accept=".png,.jpeg,.jpg,.gif,.mp4,.mov"
                    pattern="^[a-zA-Z0-9]"
                  // onChange={(e)=>onSelectFile(e)}
                  /> */}
                </Form.Group>

                <Form.Group className="mb-3 text-start text-light" controlId="formDescription">

                  <Form.Label>Name<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                  <Form.Control
                    placeholder="Item name"
                    className="form-control mb-3"
                    required
                    name="name"
                    type="text"
                  // onChange={(e)=>setName(e.target.value)} 
                  />

                  <Form.Label>Description<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                  <Form.Control
                    placeholder="Provide a detailed description of your item"
                    className="form-control mb-3"
                    required
                    name="description"
                    type="text"
                  // onChange={(e)=>setDescription(e.target.value)} 
                  />

                  <Form.Label>External link</Form.Label>
                  <Form.Control
                    placeholder="https://yoursite.io/item/123"
                    className="form-control mb-3"
                    required
                    name="name"
                    type="text"
                  // onChange={(e)=>setName(e.target.value)} 
                  />

                  <Form.Group className="mb-3 text-light" controlId="formSelectContractType">
                    <Form.Label>NFT Type<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                    <Form.Select aria-label="Default select">
                      <option selected value="ERC721">ERC721</option>
                      <option value="ERC1155">ERC1155</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3 text-light" controlId="formQty">
                    <Form.Label>Supply<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                    <Form.Control
                    min={1}
                    step={1}
                    placeholder="enter Quantity"
                    className="form-control mb-3"
                    required
                    name="name"
                    type="number"
                  // onChange={(e)=>setName(e.target.value)} 
                  />
                  </Form.Group>

                  <Form.Label>Properties<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></Form.Label>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header style={{ backgroundColor: "none" }} >Add properties</Accordion.Header>
                      <Accordion.Body>
                        <Table borderless responsive size="sm">
                          <thead>
                            <tr>
                              <th className=''>
                                <h5 className=''>Trait Type</h5>
                              </th>
                              <th className=''>
                                <h5 >Value</h5>
                              </th>
                              <th className=''>
                                <h5 ></h5>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {inputList.map((x, i) => {
                              return <tr className='' key={i}>
                                <td className='d-flex'>
                                  <input
                                    className='form-control'
                                    required
                                    name='trait_type'
                                    value={x.trait_type}
                                    placeholder='Character'
                                    type="text"
                                    onChange={e => { handleInput(e, i) }}
                                  />
                                </td>
                                <td className=''>
                                  <input
                                    className='form-control'
                                    required
                                    name='value'
                                    value={x.value}
                                    placeholder='Male'
                                    type="text"
                                    onBlur={() => saveProps()}
                                    onChange={e => handleInput(e, i)}
                                  />
                                </td>
                                <td className='d-flex'>
                                  <Button
                                    type='button'
                                    onClick={() => {
                                      if (inputList.length == 1) {
                                        setInputList([{ trait_type: "", value: "" }]);
                                      } else {
                                        removeProp(i);
                                      }
                                    }}
                                    // style={{ borderRadius: 12 }} 
                                    className='btn-danger w-100'>
                                    x
                                  </Button>
                                </td>

                              </tr>
                            })}
                          </tbody>
                        </Table>

                        <Button
                          type='button'
                          onClick={() => { addNewProp() }}>
                          Add More
                        </Button>
                        {/* <Button
                  onClick={() => { saveProps() }}>
                  Save
                </Button> */}

                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Form.Group>


              </div>
            </div>

            <Button
              type="submit"
            >Create</Button>
          </Form>



          {/* <button onClick={() => meta()}>Upload data</button> */}
          {/* <button onClick={() => mint("1000000000000000", 1, "ipfs://QmQg9uDTTgKdeDa4yfTbzn5JbspppZCS9qiXpkcnyJQCAC")}>mint</button> */}






          {/* <div>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://ipfs.infura.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                  key={image.cid.toString() + index}
                />
                <p>
                  {image.path}
                </p>

              </div>
            ))}
          </div> */}
        </>
      )}
    </Container>
  );
}