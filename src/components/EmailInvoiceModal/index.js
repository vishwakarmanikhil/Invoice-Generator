import React, { Fragment, useState } from 'react';
import { Modal, Input, Button, Radio, Form, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { generatePDFBlobAndConvertToBase64 } from '../DownloadHtmlToPDF';
import { failedModal, successModal } from '../Modal';

const EmailInvoiceModal = ({ invoiceData }) => {
    const [form] = Form.useForm();

    const [actionLoader, setActionLoader] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [customEmail, setCustomEmail] = useState('');

    const handleSendEmail = (formData) => {
        fetch('https://invoice-generator-t3sr.onrender.com/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    successModal("", "Email send successfully.");
                } else {
                    failedModal("Failed to send email, please try again!!");
                }

                setTimeout(() => {
                    setActionLoader(false);
                    setModalVisible(false);
                }, 500);
            })
            .then(data => {
                console.log('Response:', data);
            })
            .catch(error => {
                failedModal("Failed to send email, please try again!!");
                setTimeout(() => {
                    setActionLoader(false);
                    setModalVisible(false);
                }, 500);

                console.error('Error sending email:', error);
            });
    };

    const formSubmitHandler = () => {
        form.validateFields().then(async values => {
            setActionLoader(true);
            const fileUrl = await generatePDFBlobAndConvertToBase64('invoiceHtmlElementId', 600);

            let post = {
                recipientEmail: email !== 'other' ? email : customEmail,
                subject: 'Requested Invoice - Invoice Generator',
                bodyText: 'Dear, \n\n As per our recent transaction, please find attached the invoice for your reference. The details of the transaction and services/products rendered are meticulously outlined within the attached document. \n\n Note: The attached invoice is generated through our invoice generator system and contains accurate details of the transaction. Please review it at your convenience. \n\n Warm regards,\n Happy Coding!!',
                blobData: fileUrl,
                fileName: `invoice-${invoiceData?.invoice_number}.pdf`,
            }

            handleSendEmail(post);
        }).catch(errorInfo => {
            form.scrollToField(errorInfo?.errorFields?.[0]?.name, {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        });
    }


    const handleEmailChange = (e) => {
        setEmail(e);
    };

    const customEmailChangeHandler = (value) => {
        setCustomEmail(value);
    }

    return (
        <Fragment>
            <Button type={'default'} size='large' onClick={() => setModalVisible(true)}><SendOutlined /> Send Invoice</Button>
            <Modal
                title="Select Email to Send Invoice"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                className='custom-modal-style'
                footer={false}
            >
                <Form
                    form={form}
                    onFinish={formSubmitHandler}
                    layout={'vertical'}
                    scrollToFirstError={{
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                    }}
                >
                    <Form.Item
                        name={'email'}
                        rules={[{ required: true, message: 'Please select!' }]}
                    >
                        <Radio.Group onChange={(e) => handleEmailChange(e.target.value)} value={email}>
                            <Space direction="vertical">
                                <Radio value={invoiceData?.from_email}>{invoiceData?.from_email}</Radio>
                                <Radio value={invoiceData?.to_email}>{invoiceData?.to_email}</Radio>
                                <Radio value={'other'}>Other</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    {email === 'other' ?
                        <Form.Item
                            name={'custom-email'}
                            rules={[
                                {
                                    type: 'email', message: 'Please enter a valid Email Address!', validateTrigger: 'onSubmit'
                                },
                                {
                                    required: true,
                                    message: 'Please enter email address'
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => customEmailChangeHandler(e?.target?.value)}
                            />
                        </Form.Item>
                        : ""}
                    <div className='flex-row justify-content-end column-gap-10'>
                        <Button onClick={() => setModalVisible(false)} disabled={actionLoader}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType='submit' disabled={actionLoader} loading={actionLoader}>
                            Send
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Fragment>
    );
};

export default EmailInvoiceModal;