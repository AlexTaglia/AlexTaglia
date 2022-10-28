import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '../shared/const';
import { UploadFileComponent } from './UploadFileComponent';
import "./Mint.css"
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import underConstruction from '../img/under-construction.png'
import { ChainDataContext } from '../App';
import { Formik, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from "yup";


interface Props {
  trait_type: string,
  value: string;
}

const metadataSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!, min 3 char')
    .max(70, 'Too Long!, max 70 char')
    .required('Name is required'),
  description: Yup.string()
    .min(3, 'Too Short!, min 3 char')
    .max(200, 'Too Long!, max 200 char')
    .required('description is required'),
  image: Yup.mixed()
    .nullable()
    .required('Image is required')
    .test('size to big',
      'upload file', (value) => !value || (value && value.size <= MAX_FILE_SIZE))
    .test('format not valid',
      'upload file', (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))),
  attributes: Yup.array().of(Yup.object().shape({
    trait_type: Yup.string()
      .required('trait is required'),
    value: Yup.string()
      .required('value is required')
  }))
});

export const MintFormik = () => {

  const projectId = env.REACT_APP_PROJECT_ID;
  const projectSecret = env.REACT_APP_PROJECT_SECRET;
  const authorization = "Basic " + btoa(env.REACT_APP_PROJECT_ID + ":" + env.REACT_APP_PROJECT_SECRET);
  const ctx = useContext(ChainDataContext);

  const { account } = useWeb3React()
  const { mint, hanlderMessage, iswitelisted } = useChain()
  const { } = useAlchemy()
  const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()

  const [inputList, setInputList] = useState<Props[]>([{ trait_type: "", value: "" }]);
  const [propList, setPropList] = useState<Props[]>([{ trait_type: "", value: "" }]);
  const [selectedImageHome, setSelectedImageHome] = useState<any>()
  const [selectedchain, setSelectedChain] = useState<string>("0x1")
  const [minted, setminted] = useState(false)
  const [witeListed, setIsWhiteListed] = useState(false)

  const isWL = async (account: string) => {
    const wl = await iswitelisted(account)
    setIsWhiteListed(wl)
    return wl
  }

  useEffect(() => {
    if (account) {
      isWL(account)
    }

  }, [account])


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



    // callSetModal({
    //   modalIsOpen: true,
    //   type: "info",
    //   title: "Info",
    //   description: "Cooming soon"
    // })
    // return


    if (!selectedImageHome) {
      callSetModal({
        modalIsOpen: true,
        type: "info",
        title: "Info",
        description: "Plase add image",
        isLoading: false
      })
      return
    }


    const form = event.target as HTMLFormElement;
    const chain = (form[0] as HTMLInputElement).value;
    const name = (form[2] as HTMLInputElement).value;
    const description = (form[3] as HTMLInputElement).value;
    const externaLink = (form[4] as HTMLInputElement).value;
    const contractType = (form[5] as HTMLInputElement).value;
    const qTy = (form[6] as HTMLInputElement).value;
    setSelectedChain(chain)

    // console.log({ chain });
    // console.log({ name });
    // console.log({ description });
    // console.log({ externaLink });
    // console.log({ contractType });
    // console.log({ qTy });
    // console.log(selectedImageHome);
    // console.log(inputList);
    // console.log(propList);


    // Carico il file su IPFS e creo i metadati
    const metadata: Metadata = await uploadFileToIpfs(selectedImageHome, description, name, externaLink)
    console.log(metadata)

    // Carico i metadati su IPFS e mi ritorna l'has
    const hash = await uploadMetadataToIpfs(metadata)
    console.log(hash)

    // "ipfs://QmbQcmhr8bsGNeBMtn2c6vwoYyDRBKFgsDJDemvgvdabjR"
    // QmTNuSuNXaBhdopqvr6DnhbzBmFzJuN8hFizV2nn7gXKUB

    //Con l'hash miinto il mio NFT
    const minted = await mint(ctx.priceHex, 1, `ipfs://${hash}`)
    console.log({ minted });

    if (minted) {
      setminted(true)
      form.reset();
    }
  };

  useEffect(() => {
    if (minted) {
      setPropList([{ trait_type: "", value: "" }])
      setSelectedImageHome(undefined)
    }
  }, [minted])

  useEffect(() => {
    console.log(propList)
    console.log(selectedImageHome)
  }, [propList, selectedImageHome])

  const uploadFileToIpfs = async (file: File, description: string, name: string, externaLink: string) => {
    let metadata: Metadata

    try {
      hanlderMessage("info", "Uploading to ipfs", "Please wait, uploading the image to ipfs in progress ", true, false)
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
      hanlderMessage("error", "Uploading to ipfs", "Error during uploading of the file to IPFS", false, false)
      console.error({ error })
      throw error
    }

    return metadata
  }

  const uploadMetadataToIpfs = async (metadata: Metadata) => {
    let hash: string

    try {
      hanlderMessage("info", "Uploading to ipfs", "Please wait, uploading of the matadata to ipfs in progress", true, false)
      const result = await (ipfs as IPFSHTTPClient).add(JSON.stringify(metadata));
      hash = result.path
    } catch (error) {
      hanlderMessage("error", "uploadMetadataToIpfs", "Error during uploading of the metadata to IPFS", false, false)
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
    formik.setFieldValue(`attributes`, list)
    formik.setFieldTouched('attributes', true)
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
    formik.setFieldValue(`attributes`, list)
    setInputList(list);
  };

  //Salva le prop
  const saveProps = () => {
    const res1 = inputList.filter(o => Object.values(o.trait_type).every(v => v) && Object.entries(o.trait_type).length);
    const res2 = res1.filter(o => Object.values(o.value).every(v => v) && Object.values(o.value).length);
    if (res2.length === 0) {
      setPropList([{ trait_type: "", value: "" }]);
      setInputList([{ trait_type: "", value: "" }]);
      formik.setFieldValue(`attributes`, [{ trait_type: "", value: "" }])

    } else {
      setPropList(res2);
      setInputList(res2);
      formik.setFieldValue(`attributes`, res2)
    }
  }


  const [metadata] = useState<Metadata>({
    name: "",
    description: "",
    image: "",
    animation_url: "",
    attributes: [{ trait_type: "", value: "" }],
    external_url: "",
    background_color: "",
  })

  const formik = useFormik<Metadata>({
    initialValues: metadata,
    validationSchema: metadataSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("VALUES", { values });
      setSubmitting(true)
    },
  })

  useEffect(() => {
    console.log(formik.errors.attributes);

  }, [formik])


  return (
    <Container style={{ marginTop: "110px", height: "calc(100vh - 110px)", zIndex: 1 }}>
      {!ipfs && (
        <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
      )}

      {ipfs && (
        <>
          <div className='d-flex justify-content-center'>
            <div className='col-12 col-md-8 col-lg-6 p-2 text-start'>
              <h1 className='text-white mb-5 text-start d-flex'>Create your
                <div className='ps-2 d-flex'>
                  NFT
                  <span style={{ fontSize: "10px", transform: "rotate(271deg)", marginLeft: "-2px", marginTop: "15px", color: "var(--primary)" }}>ERC721</span>
                </div>
              </h1>

              <form onSubmit={formik.handleSubmit}>

                {/* NAME */}
                <label className='text-white mt-3' htmlFor="name">Name<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></label>
                <input
                  {...formik.getFieldProps('name')}
                  className="form-control"
                  type="text"
                  // onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("name", true)}
                  value={formik.values.name}
                  name="name"
                />
                {formik.errors.name && formik.touched.name && <div className='text-danger' id="feedback">{formik.errors.name}</div>}

                {/* DESCRIPTION */}
                <label className='text-white mt-3' htmlFor="description">Description<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></label>
                <input
                  {...formik.getFieldProps('description')}
                  className="form-control"
                  type="text"
                  // onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("description", true)}
                  value={formik.values.description}
                  name="description"
                />
                {formik.errors.description && formik.touched.description && <div id="feedback" className='text-danger'>{formik.errors.description}</div>}

                {/* EXTERNAL LINK */}
                <label className='text-white mt-3' htmlFor="external_url">External link</label>
                <input
                  {...formik.getFieldProps('external_url')}
                  className="form-control"
                  type="text"
                  // onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched("external_url", true)}
                  value={formik.values.external_url}
                  name="external_url"
                />

                {/* IMAGE */}
                <label className='text-white mt-3' htmlFor="image">Image</label>
                <UploadFileComponent
                  formik={formik}
                  dimensioni="800x750px"
                  file={selectedImageHome}
                  fileType={".jpeg, .jpg, .gif, .png"}
                  callback={setSelectedImageHome}
                  label=""
                />
                {formik.errors.image && formik.touched.image && <div id="feedback" className='text-danger'>{formik.errors.image}</div>}

                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ backgroundColor: "none" }} >Add properties</Accordion.Header>
                    <Accordion.Body>
                      <Table borderless responsive size="sm">
                        <thead>
                          <tr>
                            <th>
                              <h5>Trait Type</h5>
                            </th>
                            <th>
                              <h5>Value</h5>
                            </th>
                            <th>
                              <h5></h5>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {inputList.map((x, i) => {
                            return (
                              <tr className='' key={i}>

                                <td className='d-flex'>
                                  <input
                                    className='form-control'
                                    name="trait_type"
                                    // value={x.trait_type}
                                    placeholder='Character'
                                    type="text"
                                    onChange={e => { handleInput(e, i) }}
                                  />
                                </td>

                                <td className=''>
                                  <input
                                    className='form-control'
                                    name="value"
                                    // value={x.value}
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
                                    <FaTrashAlt />
                                  </Button>
                                </td>

                              </tr>

                            )
                          })}
                        </tbody>
                        {formik.errors.attributes && formik.touched.attributes && <div id="feedback" className='text-danger'>Attributes are required</div>}
                      </Table>

                      <Button
                        type='button'
                        onClick={() => { addNewProp() }}>
                        <FaPlus />
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Button
                  disabled={
                    formik.isSubmitting
                    || !formik.isValid
                    || !formik.touched
                    || !formik.values.name
                    || !formik.values.description
                    || !formik.values.image
                    || !formik.values.attributes
                  }
                  type="submit">Submit</Button>
              </form >
              <div style={{ marginBottom: "100px" }}>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}