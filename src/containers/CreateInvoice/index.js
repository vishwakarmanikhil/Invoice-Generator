import React, { useRef, useState } from 'react';
import { Spin } from 'antd';
import InvoiceForm from './InvoiceForm.js';
import { failedModal, successModal, somethingWentWrong } from '../../components/Modal/index.js';
import './style.css';

const intialInvoiceData = {
    invoice_number: null,
    created_date: null,
    due_date: null,
    from_email: '',
    from_address: '',
    to_email: '',
    to_address: '',
    currencySign: 'USD',
    currencySymbol: '$',
    tax_percentage: 0,
    subTotalAmount: 0,
    taxableAmount: 0,
    totalAmount: 0,
    adavanceAmount: 0,
    remainingAmount: 0,
    notes: '',
    invoice_status: '',
};

const invoiceItemList = {
    title: "",
    rate: 0,
    quantity: 1,
    amount: 0,
}

const CreateInvoice = () => {
    const invoiceFormRef = useRef();

    const [actionLoader, setActionLoader] = useState(false);

    const createInvoiceHandler = (data) => {
        setActionLoader(true);

        fetch(`http://localhost:5000/createFile/${data?.invoice_number}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            response.text()
            let status_code = response?.status;
            if(status_code === 200) {
                invoiceFormRef?.current?.formResetHandler();
                const invoiceLinkPreview = (
                    <a href={`/invoice/${data?.invoice_number}`} target={'_blank'} className='p-m-txt preview-link-txt'>View Invoice</a>
                )
                successModal(invoiceLinkPreview, "Invoice Created successfully");
            }else {
                failedModal("Failed to create Invoice!!");
            }

            setTimeout(() => {
                setActionLoader(false);
            }, 500);
        })
        .then((data) => {
            // console.log('data', data)
        })
        .catch((error) => {
            console.error('Error:', error);
            somethingWentWrong();

            setTimeout(() => {
                setActionLoader(false);
            }, 500);
        });
    }

    return (
        <div className='create-invoce__page'>
            <Spin
                spinning={actionLoader}
            >
            <InvoiceForm 
                ref={invoiceFormRef}
                createInvoiceHandler={createInvoiceHandler}
                invoiceItemList={invoiceItemList}
                intialInvoiceData={intialInvoiceData}
            />
            </Spin>
        </div>
    );
};

export default CreateInvoice;