import React, { Fragment, useEffect } from 'react';
import { Divider, Alert, Button } from 'antd';
import { isNotEmpty } from '../../components/CommonFunction';
import { dueDateNear, dueDatePassed } from '../../components/Modal';
import { CloseCircleFilled, DownloadOutlined } from '@ant-design/icons';
import EmailInvoiceModal from '../../components/EmailInvoiceModal';
import { downloadHTMLToPDFFile } from '../../components/DownloadHtmlToPDF';
import Color from '../../constants/Colors';

const InvoicePreview = (props) => {
    const { invoiceData } = props;

    useEffect(() => {
        if(invoiceData?.invoice_status !== 'paid') {
            if (invoiceData?.due_date !== '' && invoiceData?.due_date !== null && invoiceData?.due_date !== undefined) {
                //check for due date to show modal accordingly
                const [day, month, year] = invoiceData.due_date.split('-').map(Number);
                let invoice_due_date = new Date(year, month - 1, day);
                let today = new Date();
            
                invoice_due_date.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
            
                // Calculate the difference in milliseconds between the due date and today's date
                const timeDifference = invoice_due_date.getTime() - today.getTime();
                const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
            
                if (timeDifference <= threeDaysInMilliseconds && timeDifference > 0) {
                    dueDateNear();
                } else if (invoice_due_date <= today) {
                    dueDatePassed();
                }
            }            
        }
    }, [invoiceData]);

    const downloadReceipt = () => {
        downloadHTMLToPDFFile('invoiceHtmlElementId', 600, `invoice-${invoiceData?.invoice_number}.pdf`);
    }
    
    return (
        isNotEmpty(invoiceData) ?
            <Fragment>
                <div className='pi__content-wrap' id='invoiceHtmlElementId'>
                    <p className='h4-heading mb-0'>Invoice <span>#{invoiceData?.invoice_number}</span></p>

                    <Divider />

                    <div className='pi__contact-wrap'>
                        <div>
                            <p className='p-m-txt txt-opacity-8 mb-5'>Bill From:</p>
                            <p className='p-l-txt mb-5'>{invoiceData?.from_email}</p>
                            <p className='p-s-txt txt-opacity-6 mb-0'>{invoiceData?.from_address}</p>
                        </div>
                        <div>
                            <p className='p-m-txt txt-opacity-8 mb-5'>Bill To:</p>
                            <p className='p-l-txt mb-5'>{invoiceData?.to_email}</p>
                            <p className='p-s-txt txt-opacity-6 mb-0'>{invoiceData?.to_address}</p>
                        </div>
                        <div>
                            <p className='p-m-txt txt-opacity-8 mb-5'>Issued On:</p>
                            <p className='p-l-txt mb-5'>{invoiceData?.created_date}</p>
                        </div>
                        <div>
                            <p className='p-m-txt txt-opacity-8 mb-5'>Due Date:</p>
                            <p className='p-l-txt mb-5'>{invoiceData?.due_date !== '' && invoiceData?.due_date !== null && invoiceData?.due_date !== undefined ? invoiceData?.due_date : 'No Due Date'}</p>
                        </div>
                    </div>

                    <div className='pi-items__container'>
                        <p className='p-s-txt mb-5'>Invoice Detail</p>

                        <div className='pi-items__wrapper'>
                            <div className='pi-items__header'>
                                <p className='p-m-txt mb-0'>Description</p>
                                <p className='p-m-txt mb-0'>Price</p>
                                <p className='p-m-txt mb-0'>Qty</p>
                                <p className='p-m-txt mb-0'>Total Amount</p>
                            </div>
                            <div className='pi-items__body'>
                                {invoiceData?.invoiceItemData?.map((data, key) => {
                                    return (
                                        <div className='pi-item__item' key={`invoice-item-${key}`}>
                                            <p className='p-m-txt txt-opacity-6 mb-0'>{data?.title}</p>
                                            <p className='p-m-txt txt-opacity-6 mb-0'>{invoiceData?.currencySymbol}{data?.rate}</p>
                                            <p className='p-m-txt txt-opacity-6 mb-0'>{data?.quantity}</p>
                                            <p className='p-m-txt txt-opacity-6 mb-0'>{invoiceData?.currencySymbol}{data?.rate * data?.quantity}</p>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className='pi-items__footer'>
                                <div className='pi-item__item'>
                                    <p className='p-m-txt txt-opacity-8 mb-0'>Sub Total</p>
                                    <p className='mb-0'></p>
                                    <p className='mb-0'></p>
                                    <p className='p-m-txt txt-opacity-8 mb-0'>{invoiceData?.currencySymbol}{invoiceData?.subTotalAmount}</p>
                                </div>
                                <div className='pi-item__item'>
                                    <p className='p-m-txt txt-opacity-8 mb-0'>Tax Amount</p>
                                    <p className='mb-0'></p>
                                    <p className='mb-0'></p>
                                    <p className='p-m-txt txt-opacity-8 mb-0'>{invoiceData?.currencySymbol}{invoiceData?.taxableAmount}</p>
                                </div>
                                <div className='pi-item__item'>
                                    <p className='p-l-txt mb-0'>Grand Total</p>
                                    <p className='mb-0'></p>
                                    <p className='mb-0'></p>
                                    <p className='p-l-txt mb-0'>{invoiceData?.currencySymbol}{invoiceData?.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                        {invoiceData?.invoice_status === 'paid' ?
                            <div className='pi-items__paid-wrap'>
                                <p className='h5-heading mb-0'>Paid</p>
                            </div>
                        :   ""}
                    </div>
                    {invoiceData?.notes !== '' && invoiceData?.notes !== null & invoiceData?.notes !== undefined ?
                        <div className='pi-notes__wrap'><Alert message={`Notes: ${invoiceData?.notes}`} type="warning" showIcon /></div>
                    : ""}
                </div>
                <div className='flex-row justify-content-end column-gap-20 pt-30 pb-30'>
                    <EmailInvoiceModal 
                        invoiceData={invoiceData}
                    />
                    <Button onClick={downloadReceipt} type={'primary'} size='large'><DownloadOutlined /> Download Invoice</Button>
                </div>
            </Fragment>
        :
            <div className='pi-nodata__container'>
                <div className='pinc__wrap'>
                    <CloseCircleFilled style={{ color: Color.redColor, fontSize: 50 }} />
                    <p className='h4-heading mb-20 mt-30'>Something went wrong!!</p>
                    <p className='p-l-txt mb-0'>Please check your invoice number is correct in URL or try again after some time.</p>
                </div>
            </div>
    );
};

export default InvoicePreview;