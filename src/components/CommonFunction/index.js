import React from 'react';
import CountryCurrencyData from '../currencyData.json';
import dayjs from 'dayjs';

// Custom comparison function for sorting by countryName
function compareCountryNames(a, b) {
    const countryNameA = a.countryName.toUpperCase();
    const countryNameB = b.countryName.toUpperCase();

    if (countryNameA < countryNameB) {
        return -1;
    }
    if (countryNameA > countryNameB) {
        return 1;
    }
    return 0;
}

// Create a new array where objects with the same currencyCode are combined
export function currencyCountryData() {
    // Sort the CountryCurrencyData array by countryName
    const sortedData = CountryCurrencyData.sort(compareCountryNames);

    return sortedData.reduce((acc, obj) => {
        const existingObj = acc.find(item => item?.currencyCode === obj.currencyCode);
        if (existingObj) {
            existingObj.population += Number(obj.population);
            existingObj.countryName += `, ${obj.countryName}`;
        } else {
            acc.push(obj);
        }
        return acc;
    }, []);
}

export function isNotEmpty(obj) {
  return Object.keys(obj).length > 0;
}

export function disabledDate(current) {
    // Can not select days before today
    return dayjs(current).isBefore(dayjs().startOf('day'), 'day');
}