import { useFormik } from "formik";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { NumericFormat } from 'react-number-format';
import * as Yup from 'yup'
import { CreateTransfer } from "../../types";


interface iNewTransfer {
    createTransfer: (transferId: number) => void
}

export const NewTransfer = (p: iNewTransfer) => {
    const [transfer, setTransfer] = useState({})

    const updateTransfer = (e: any, field: any) => {
        const value = e.target.value;
        setTransfer({ ...transfer, [field]: value })
    }

    // const submit = (e: any) => {
    //     e.preventDefault()
    //     p.createTransfer(transfer)
    // }

    const transferSchema = Yup.object().shape({
        amount: Yup.string()
            .required('Amount is required'),
        to: Yup.string()
            .required('Address is required')
    })


    const [transferInit] = useState<CreateTransfer>({
        amount: "",
        to: ""
    })

    const formik = useFormik<CreateTransfer>({
        initialValues: transferInit,
        validationSchema: transferSchema,
        onSubmit: async (values, { setSubmitting }) => {
            console.log({ values })
        },
    })

    return (
        <div >
            <h2>Create transfer</h2>
            <form onSubmit={formik.handleSubmit} >

                <div>
                    <label htmlFor="amount">Amount<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></label>
                    <NumericFormat
                        {...formik.getFieldProps('amount')}
                        name='amount'
                        className="form-control"
                        thousandSeparator={true}
                        decimalSeparator="."
                        allowNegative={false}
                        decimalScale={2}
                        value={(formik.values.amount)}
                        allowLeadingZeros={false}
                        onValueChange={
                            // formik.handleChange
                            val => { formik.setFieldValue("amount", val.value) }
                        }
                    />
                    {formik.errors.amount && formik.touched.amount && <div className='text-error' id="feedback">{formik.errors.amount}</div>}
                </div>

                <div>
                    <label htmlFor="to">T0<sup className='text-danger' style={{ fontSize: "16px" }}>*</sup></label>
                    <input
                        {...formik.getFieldProps('to')}
                        onBlur={() => formik.setFieldTouched("to", true)}
                        value={formik.values.to}
                        name="to"
                        className="form-control"
                        id="to"
                        type="text"
                    />
                    {formik.errors.to && formik.touched.to && <div className='text-error' id="feedback">{formik.errors.to}</div>}
                </div>

                <Button
                    disabled={
                        formik.isSubmitting
                        || !formik.isValid
                        || !formik.touched
                        || !formik.values.to
                        || !formik.values.amount
                    }
                    className="mt-5"
                    type="submit">
                    Submit
                </Button>

            </form>
        </div>
    );

}
