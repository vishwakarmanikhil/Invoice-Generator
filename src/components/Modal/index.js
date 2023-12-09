import React from 'react';
import { Modal, Button } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, InfoCircleTwoTone } from "@ant-design/icons";
import Color from "../../constants/Colors";

export function successModal(customPreview, messageTxt) {
    Modal.success({
        title: false,
        content: (
            <div className='flex-column mb-50 mt-50'>
                <CheckCircleTwoTone style={{ fontSize: 50 }} twoToneColor={Color.greenColor} />
                <p className='h6-heading mt-20 mb-30'>{messageTxt}</p>
                <div className="mb-30">
                    {customPreview}
                </div>
                <Button type={'primary'} size={'large'} onClick={() => Modal.destroyAll()}>Okay</Button>
            </div>
        ),
        footer: false,
        className: 'modal-style action-modal__style',
        centered: true
    });
}

export function failedModal(messageTxt) {
    Modal.error({
        title: false,
        content: (
            <div className='flex-column mb-50 mt-50'>
                <CloseCircleTwoTone style={{ fontSize: 50 }} twoToneColor={Color.redColor} />
                <p className='h6-heading mt-20 mb-30'>{messageTxt}</p>
                <Button type={'primary'} size={'large'} onClick={() => Modal.destroyAll()}>Okay</Button>
            </div>
        ),
        footer: false,
        className: 'modal-style action-modal__style',
        centered: true
    });
}

export function somethingWentWrong() {
    Modal.error({
        title: false,
        content: (
            <div className='flex-column mb-50 mt-50'>
                <CloseCircleTwoTone style={{ fontSize: 50 }} twoToneColor={Color.redColor} />
                <p className='h6-heading mt-20 mb-30'>Something Went Wrong. Please try Again!!</p>
                <Button type={'primary'} size={'large'} onClick={() => Modal.destroyAll()}>Okay</Button>
            </div>
        ),
        footer: false,
        className: 'modal-style action-modal__style',
        centered: true
    });
}

export function dueDateNear() {
    Modal.info({
        title: false,
        content: (
            <div className='flex-column mb-50 mt-50'>
                <InfoCircleTwoTone style={{ fontSize: 50 }} twoToneColor={Color.orangeColor} />
                <p className='h6-heading mt-20 mb-10'>Due Date is near!!</p>
                <p className="p-m-txt text-align-center mb-30">Invoice Due date is near, please make payment to avoid late fees charges.</p>
                <Button type={'primary'} size={'large'} onClick={() => Modal.destroyAll()}>Okay</Button>
            </div>
        ),
        footer: false,
        className: 'modal-style action-modal__style',
        centered: true
    });
}

export function dueDatePassed() {
    Modal.info({
        title: false,
        content: (
            <div className='flex-column mb-50 mt-50'>
                <InfoCircleTwoTone style={{ fontSize: 50 }} twoToneColor={Color.orangeColor} />
                <p className='h6-heading mt-20 mb-10'>Due Date is crossed!!</p>
                <p className="p-m-txt text-align-center mb-30">Kindly contact authority, before making payment. Since due date is passed for this invoice.</p>
                <Button type={'primary'} size={'large'} onClick={() => Modal.destroyAll()}>Okay</Button>
            </div>
        ),
        footer: false,
        className: 'modal-style action-modal__style',
        centered: true
    });
}