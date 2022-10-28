import React, { CSSProperties, useEffect, useMemo, useState } from "react"
import Tooltip from 'react-bootstrap/Tooltip';
import { OverlayTrigger } from "react-bootstrap";
import { filetypeIsAllowed, filetypeIsAudio, filetypeIsImage, filetypeIsVideo } from "../shared/utils/fileUtils";
import { FormikProps, FieldInputProps, FormikContextType, Formik } from 'formik'

export interface UploadFileComponentProps {
    previewType?: "video" | "audio" // default == image
    label: string
    url?: string
    fileType: string
    callback: (param: any) => void
    id?: string
    file?: File
    dimensioni: string
    formik: FormikContextType<any>
}

export interface AssetFile {
    file: File
    src?: string
}

export const UploadFileComponent = (props: UploadFileComponentProps) => {

    const [selectedFile, setSelectedFile] = useState<AssetFile>()
    const [isValid, setIsValid] = useState(true)
    const inputId = `imageObject${props.label.replace(" ", "")}${props?.id}`

    // copia immagine
    useEffect(() => {
        if (props.file) {
            const file = props.file
            const assetFile = { file, src: URL.createObjectURL(file) } as AssetFile
            setSelectedFile(assetFile);
            props.callback(assetFile.file);
            setIsValid(true);
        }
    }, [props.file])

    const onSelectFile = (e: any) => {
        props.formik.setFieldTouched('image', true)

        if (!e.target.files || e.target.files.length === 0) {
            setIsValid(false);
            setSelectedFile(undefined);
            props.formik.setFieldValue("image", undefined)
            return
        }
        const file = e.target.files[0]

        const isValidExtension = filetypeIsAllowed(file?.type, props.previewType);
        if (!isValidExtension) {
            setIsValid(false);
            setSelectedFile(undefined);
            props.formik.setFieldValue("image", undefined)
            return
        }
        const assetFile = { file, src: URL.createObjectURL(file) } as AssetFile
        setSelectedFile(assetFile);
        props.formik.setFieldValue("image", assetFile?.file)
        props.callback(assetFile?.file);
        setIsValid(true);
        e.target.value = null;
    }

    const showPreviewImage = useMemo(() => {

        const commonStyle = {width: "100%", height: "300px",objectFit: "contain",backgroundColor: "#F5F8FA"} as CSSProperties
        if (!selectedFile && isValid) {
            if (!!props?.url) {
                if (props.previewType === "video") {
                    return <video className='border rounded border-dark p-2' style={commonStyle} src={props.url} controls loop autoPlay />
                }
                else if (props.previewType === "audio") {
                    return <audio controls className='w-75'>
                        <source style={{ zIndex: 9 }} src={props.url} type="audio/mpeg" />
                    </audio>
                }
                else {
                    return <img className="border rounded border-dark p-2" style={commonStyle} src={props?.url} />
                }
            }
            else if (props.previewType === "audio") {
                return <div className="border rounded border-dark p-2" style={{ width: "410px", height: "54px", objectFit: "contain", backgroundColor: "#F5F8FA" }} />
            } else {
                return <div className="border rounded border-dark p-2" style={commonStyle} />
            }

        }

        if (!!selectedFile && isValid) {
            if (filetypeIsVideo(selectedFile?.file?.type) && props.previewType === "video") {
                return <video className='border rounded border-dark p-2' style={commonStyle} src={selectedFile?.src} controls loop autoPlay />
            }
            else if (filetypeIsAudio(selectedFile?.file?.type) && props.previewType === "audio") {
                return (
                    <audio controls className='w-75'>
                        <source style={{ zIndex: 9 }} src={selectedFile?.src} type="audio/mpeg" />
                    </audio>
                )
            }
            else if (filetypeIsImage(selectedFile?.file.type)) {
                return <img className='border rounded border-dark p-2 ' style={commonStyle} src={selectedFile?.src} />
            }
        }
        else {
            return <h5 className="">Estensione file non corretta. Puoi caricare:<br /> {props.fileType} </h5>
        }

    }, [selectedFile, isValid, props?.url, props.previewType])

    const showDeleteFile = useMemo(() => {
        if (selectedFile || !isValid) {
            return <>
                <div className="cursor-pointer btn btn-danger"
                    onClick={() => {
                        setIsValid(true);
                        setSelectedFile(undefined)
                        props.formik.setFieldValue("image", undefined)
                        props.callback(undefined);
                    }}>
                    {/* <i className="fas fa-trash fs-2"></i> */}
                    <span> Delete</span>
                </div>
            </>
        } else {
            return null
        }
    }, [selectedFile, isValid])


    return (
        <>
            <div className="w-100 text-start">
                <div className="w-100">
                    {showPreviewImage}
                </div>
                <input
                    {...props.formik.getFieldProps("image")}
                    name="image"
                    accept={props.fileType}
                    className="d-none"
                    id={inputId}
                    type="file"
                    onChange={onSelectFile}
                    onBlur={() => props.formik.setFieldTouched('image', true)}
                    value={undefined}

                />
                <div className="mt-2">
                    <label htmlFor={inputId} className="btn btn-primary" style={{ marginRight: "10px" }}>Choose file</label>
                    {showDeleteFile}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, marginRight: 10 }} className='required mb-2'>{props.label}</span>
                <OverlayTrigger
                    placement={"top"}
                    overlay={
                        <Tooltip>
                            You can upload: {props.fileType}. <br /> {props.dimensioni !== "" && `Dimensioni ${props.dimensioni}`}
                        </Tooltip>
                    }
                >
                    <i style={{ lineHeight: "25px" }} className={`fa fa-solid fa-question text-gray-600 fs-5 p-0`}></i>
                </OverlayTrigger>
            </div>
        </>

    )
}