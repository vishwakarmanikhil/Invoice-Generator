import React, { useState, useEffect, Fragment, useImperativeHandle } from 'react';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Switch, Space, Select } from 'antd';
import CurrencyPicker from '../../components/CurrencyPicker.js';
import { currencyCountryData, disabledDate } from '../../components/CommonFunction';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import IconAssets from '../../components/SvgAssets/IconAssets.js';
import Color from '../../constants/Colors.js';

const { Option } = Select;

const InvoiceForm = React.forwardRef((props, ref) => {
    const { intialInvoiceData, invoiceItemList, createInvoiceHandler } = props;
    const [form] = Form.useForm();

    const [notesRequired, setNotesRequired] = useState(false);
    const [invoiceStatus, setInvoiceStatus] = useState('un-paid');

    const [invoiceData, setInvoiceData] = useState({});
    const [invoiceItemData, setInvoiceItemData] = useState([]);

    useEffect(() => {
        stateInitialHandler();
    }, [intialInvoiceData, invoiceItemList]);

    const stateInitialHandler = () => {
        //create copy of json file to avoid having reference
        let outsideObjectCopy1 = JSON.parse(JSON.stringify(intialInvoiceData));
        let outsideObjectCopy2 = JSON.parse(JSON.stringify(invoiceItemList));
        outsideObjectCopy1 = {
            ...outsideObjectCopy1
        }

        setInvoiceData(outsideObjectCopy1);
        setInvoiceItemData([outsideObjectCopy2])
    }

    const notesActionChangeHandler = (value) => {
        setNotesRequired(value);
    }

    const currencyChangeHandler = (value) => {
        setInvoiceData((prevInvoiceData) => {
            const updatedInvoiceData = {
                ...prevInvoiceData,
                currencySign: value,
            };

            return updatedInvoiceData;
        });
        curencySignHandler(value);
    }

    const curencySignHandler = (value) => {
        let currency_symbol = '';
        currency_symbol = currencyCountryData()?.filter(d => d.currencyCode === value);
        if (currency_symbol.length > 0) {
            setInvoiceData((prevInvoiceData) => {
                const updatedInvoiceData = {
                    ...prevInvoiceData,
                    currencySymbol: currency_symbol?.[0]?.Symbol,
                };

                return updatedInvoiceData;
            });
        } else {
            setInvoiceData((prevInvoiceData) => {
                const updatedInvoiceData = {
                    ...prevInvoiceData,
                    currencySymbol: '',
                };

                return updatedInvoiceData;
            });
        }
    }

    const formSubmitHandler = () => {
        form.validateFields().then(async values => {
            let created_date = values['created_date']?.format('DD-MM-YYYY');
            let due_date = values['due_date']?.format('DD-MM-YYYY');
            let post = {
                ...invoiceData,
                ...values,
                created_date: created_date,
                due_date: due_date !== undefined && due_date !== '' && due_date !== null ? due_date : '',
                invoice_status: invoiceStatus,
            }
            createInvoiceHandler(post);
        }).catch(errorInfo => {
            form.scrollToField(errorInfo?.errorFields?.[0]?.name, {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        });
    }

    const taxChangeHandler = (value) => {
        let updatedData;
        setInvoiceData((prevInvoiceData) => {
            const updatedInvoiceData = {
                ...prevInvoiceData,
                tax_percentage: Number(value),
            };

            updatedData = updatedInvoiceData;
            return updatedInvoiceData;
        });

        valueChangeHandler(updatedData, invoiceItemData);
    }

    const itemValueChangeHandler = async (value, item, index) => {
        let updatedItemData;
        await setInvoiceItemData((prevInvoiceItemData) => {
            const updatedInvoiceItemData = [...prevInvoiceItemData];
            const currentItem = { ...updatedInvoiceItemData[index] };

            currentItem[item] = value;

            // Calculate amount if rate or quantity is updated
            if (item === 'rate' || item === 'quantity') {
                const rate = currentItem.rate || 0;
                const quantity = currentItem.quantity || 1;
                currentItem.amount = rate * quantity;
            }

            updatedInvoiceItemData[index] = currentItem;
            updatedItemData = updatedInvoiceItemData;
            return updatedInvoiceItemData;
        });

        if (item === 'rate' || item === 'quantity') {
            valueChangeHandler(invoiceData, updatedItemData);
        }
    };

    const itemRemoveHandler = (index) => {
        let updatedItemData;
        setInvoiceItemData((prevInvoiceItemData) => {
            const updatedInvoiceItemData = prevInvoiceItemData.filter((_, i) => i !== index);
            updatedItemData = updatedInvoiceItemData;
            return updatedInvoiceItemData;
        });

        valueChangeHandler(invoiceData, updatedItemData);
    };

    const itemAddHandler = () => {
        let outsideObjectCopy = JSON.parse(JSON.stringify(invoiceItemList));
        setInvoiceItemData((prevInvoiceItemData) => [...prevInvoiceItemData, { ...outsideObjectCopy }]);
    }

    const valueChangeHandler = async (updatedData, updatedItemData) => {
        let tax_amount = 0;
        const subtotal = await updatedItemData.reduce((total, currentItem) => {
            return total + currentItem.amount;
        }, 0);
        const taxPercentage = Number(updatedData?.tax_percentage) || 0;
        const advanceAmount = Number(updatedData?.adavanceAmount) || 0;

        if (taxPercentage !== 0 && taxPercentage !== null && taxPercentage !== '' && taxPercentage !== undefined) {
            tax_amount = (subtotal * taxPercentage) / 100;
        }
        const total_amount = subtotal + tax_amount;
        const remaining_amount = total_amount - advanceAmount;

        setInvoiceData({
            ...updatedData,
            subTotalAmount: subtotal?.toFixed(2),
            taxableAmount: tax_amount?.toFixed(2),
            totalAmount: total_amount?.toFixed(2),
            remainingAmount: remaining_amount?.toFixed(2),
        });
    };

    const handleRemove = (index) => {
        form.setFieldsValue({
          invoiceItemData: form.getFieldsValue().invoiceItemData.filter((item, i) => i !== index)
        });
    };
    
    const handleAdd = () => {
        form.setFieldsValue({
            invoiceItemData: [...form.getFieldsValue().invoiceItemData, { title: '', quantity: 1, rate: 0 }]
        });
    };

    const invoiceStatusChangeHandler = (value) => {
        setInvoiceStatus(value);
    }

    const taxFieldValidator = (_, value) => {
        if(value !== '' && value !== null && value !== undefined) {
            if(value < 0 || value > 100) {
                return Promise.reject(new Error(`Tax percentage between 0 - 100 is allowed!`));
            }
        }

        return Promise.resolve();
    }

    const formResetHandler = () => {
        stateInitialHandler();
        setInvoiceStatus('un-paid');
        setNotesRequired(false);
        form.resetFields();
    }

    useImperativeHandle(ref, () => {
        return {
            formResetHandler: formResetHandler
        }
    });

    return (
        <Form
            form={form}
            onFinish={formSubmitHandler}
            layout={'vertical'}
            scrollToFirstError={{
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            }}
            className='create-invoice__form'
        >
            <div className='cif-body__wrap'>
                <div>
                    <div className='flex-row justify-space-between gap-20 mb-20'>
                        <div>
                            <p className='p-m-txt mb-5'>Invoice Date</p>
                            <Form.Item
                                name={'created_date'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select invoice date'
                                    },
                                ]}
                                initialValue={invoiceData?.created_date}
                            >
                                <DatePicker
                                    placeholder='Date'
                                    format={'DD-MM-YYYY'}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <p className='p-m-txt mb-5'>Due Date</p>
                            <Form.Item
                                name={'due_date'}
                            >
                                <DatePicker
                                    placeholder='Due Date'
                                    format={'DD-MM-YYYY'}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <Row className='mb-20'>
                        <Col span={24}>
                            <p className='p-m-txt mb-5'>Invoice Number</p>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={'invoice_number'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input invoice number'
                                    }
                                ]}
                            >
                                <InputNumber 
                                    className='custom-input-style' 
                                    placeholder='0001' 
                                    onWheel={() => document.activeElement.blur()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={[16, 16]}>
                        <Col md={12} sm={24} xs={24}>
                            <p className='p-m-txt mb-5'>Bill From:</p>
                            <Form.Item
                                name={'from_email'}
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
                                <Input className='custom-input-style ' type='email' placeholder='Email Address' />
                            </Form.Item>
                            <Form.Item
                                name={'from_address'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter address'
                                    },
                                ]}
                            >
                                <Input.TextArea className='custom-textarea-style' rows={4} placeholder='Address...' />
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24} xs={24}>
                            <p className='p-m-txt mb-5'>Bill To:</p>
                            <Form.Item
                                name={'to_email'}
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
                                <Input className='custom-input-style ' placeholder='Email Address' />
                            </Form.Item>
                            <Form.Item
                                name={'to_address'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter address'
                                    },
                                ]}
                            >
                                <Input.TextArea className='custom-textarea-style' rows={4} placeholder='Address...' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className='cif-item__container mt-50'>
                        <div className='cif-item__header'>
                            <p className='p-m-txt mb-0'>item</p>
                            <p className='p-m-txt mb-0'>qty</p>
                            <p className='p-m-txt mb-0'>rate</p>
                            <p className='p-m-txt mb-0'>total</p>
                            <p className='p-m-txt mb-0'>action</p>
                        </div>
                        <div className='cif-item__list'>
                            <Form.List
                                name="invoiceItemData"
                                initialValue={[{ title: '', quantity: 1, rate: 0 }]}
                            >
                                {(fields) => (
                                    <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <Space key={key} className='cif-item__item'>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'title']}
                                                    fieldKey={[fieldKey, 'title']}
                                                    rules={[{ required: true, message: 'Please enter title' }]}
                                                >
                                                    <Input className='custom-input-style' placeholder="Item name" onChange={(e) => itemValueChangeHandler(e?.target?.value, 'title', key)} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    fieldKey={[fieldKey, 'quantity']}
                                                    rules={[{ required: true, message: 'Please enter quantity' }]}
                                                >
                                                    <InputNumber 
                                                        className='custom-input-style number' 
                                                        onChange={(e) => itemValueChangeHandler(e, 'quantity', key)} 
                                                        onWheel={() => document.activeElement.blur()}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'rate']}
                                                    fieldKey={[fieldKey, 'rate']}
                                                    rules={[{ required: true, message: 'Please enter rate' }]}
                                                >
                                                    <InputNumber 
                                                        className='custom-input-style number' 
                                                        onChange={(e) => itemValueChangeHandler(e, 'rate', key)} 
                                                        onWheel={() => document.activeElement.blur()}
                                                    />
                                                </Form.Item>
                                                <p className='p-m-txt mb-0'>{invoiceData?.currencySymbol}{invoiceItemData?.[name]?.amount}</p>
                                                {fields.length > 1 ? (
                                                    <Button
                                                        onClick={() => {handleRemove(name); itemRemoveHandler(name)}}
                                                        type={'primary'}
                                                        danger                                                        
                                                    >
                                                        <DeleteOutlined />
                                                    </Button>
                                                ) : null}
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={() => {handleAdd(); itemAddHandler()}}
                                                icon={<PlusOutlined />}
                                                className='mt-20'
                                            >
                                                Add Item
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </div>

                    <Divider />
                    <div className='cif-total__wrap'>
                        <div></div>
                        <div>
                            <div className='mb-10'>
                                <p className='p-m-txt mb-0'>Subtotal: </p>
                                <div>
                                    <p className='p-m-txt mb-0'>{invoiceData?.currencySymbol} {invoiceData?.subTotalAmount}</p>
                                </div>
                            </div>
                            <div className=''>
                                <p className='p-m-txt mb-0'>Tax:</p>
                                <div>
                                    <Form.Item
                                        name={'tax_percentage'}
                                        rules={[{ required: true, validator: taxFieldValidator, validateTrigger: 'onSubmit' }]}
                                    >
                                        <InputNumber
                                            placeholder='Ex. 18%'
                                            onChange={(e) => taxChangeHandler(e)}
                                            className='custom-input-style'
                                            onWheel={() => document.activeElement.blur()}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className=''>
                                <p className='p-l-txt mb-0'>Total: </p>
                                <div>
                                    <p className='p-l-txt mb-0'>{invoiceData?.currencySymbol} {invoiceData?.totalAmount}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {notesRequired ?
                        <Fragment>
                            <Divider />
                            <p className='p-m-txt mb-5'>Notes:</p>
                            <Form.Item
                                name={'notes'}
                                rules={[
                                    {
                                        required: notesRequired,
                                        message: 'Please eneter notes to invoice'
                                    }
                                ]}
                            >
                                <Input.TextArea className='custom-textarea-style' rows={3} />
                            </Form.Item>
                        </Fragment>
                        : ""}
                </div>
                <div>
                    <div>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' className='custom-btn create-invoice__btn'><IconAssets.CreateInvoiceOutlineIcon height='20' width='20' filledColor={Color.whiteColor} /> Create Invoice</Button>
                        </Form.Item>
                        <Divider />
                    </div>

                    <div>
                        <div className=''>
                            <p className='p-m-txt mb-5'>Invoice status</p>
                            <Select
                                value={invoiceStatus || undefined}
                                onChange={(e) => invoiceStatusChangeHandler(e)}
                                className='custom-select-style'
                                placeholder='Select Invoice status'
                            >
                                <Option value='paid'>Paid</Option>
                                <Option value='un-paid'>Un-Paid</Option>
                            </Select>
                        </div>

                        <Divider />

                        <div className=''>
                            <p className='p-m-txt mb-5'>Currency</p>
                            <CurrencyPicker
                                currencyValue={invoiceData?.currencySign}
                                currencyChangeHandler={currencyChangeHandler}
                                className={'custom-select-style project-currency-select'}
                                overlayClassName={'custom-select-dropdown-style project-currency-select-dropdown'}
                            />
                        </div>

                        <Divider />

                        <div className='flex-row justify-space-between column-gap-10'>
                            <p className='p-m-txt mb-0'>Notes</p>
                            <Switch
                                onChange={notesActionChangeHandler}
                            />
                        </div>
                        <Divider />
                    </div>

                </div>
            </div>
        </Form>
    );
});

export default InvoiceForm;