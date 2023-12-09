import React from 'react';
import { Select } from 'antd';
import { currencyCountryData } from '../CommonFunction';

const { Option } = Select;

const CurrencyPicker = (props) => {
    const { currencyValue,  currencyChangeHandler, className, overlayClassName} = props;

    return (
        <Select
            value={currencyValue}
            placeholder="ex. USD"
            className={className}
            showSearch
            onChange={currencyChangeHandler}
            filterOption={(input, option) =>
                option.props.children[0].props.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                option.props.children[1].props.children[0]
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
            }
            popupClassName={overlayClassName}
        >
            {currencyCountryData().map((data, key) => {
                return <Option key={key} value={`${data.currencyCode}`}>
                    <span className="countryCodeTxt">{data.currencyCode}</span>
                    <span className="countryNameTxt">{data.countryName} </span>
                </Option>
            })}
        </Select>
    );
};

export default CurrencyPicker;