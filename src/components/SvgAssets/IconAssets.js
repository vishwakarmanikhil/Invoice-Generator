import React from 'react';

const CreateInvoiceOutlineIcon = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props?.width} height={props?.height} viewBox="0 0 21 21">
            <g fill="none" fillRule="evenodd" stroke={props?.filledColor} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"/>
                <path d="M17.5 3.467a1.462 1.462 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.409 1.409 0 0 1 1.885-.104zm-2 2.033l.953 1"/>
            </g>
        </svg>
    );
};

const IconAssets = {
    CreateInvoiceOutlineIcon
}

export default IconAssets;