import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvoicePreview from './InvoicePreview';
import './style.css';

let firstPageCall = false;

const ViewInvoice = () => {
    const { invoiceID } = useParams();

    const [loader, setLoader] = useState(true);
    const [invoiceData, setInvoiceData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/getFile/${invoiceID}`);
            if (response.ok) {
              const data = await response.json();
              // console.log(data);
              setInvoiceData(data);
            } else {
              throw new Error('Failed to fetch data');
            }

            setTimeout(() => {
              setLoader(false);
            }, 500);
          } catch (error) {
            console.error(error);
            // Handle error

            setTimeout(() => {
              setLoader(false);
            }, 500);
          }
        };
    
        if(!firstPageCall) {
          firstPageCall = true;
          fetchData();
        }
    }, [invoiceID]);

    return (
      <div className='preview-invoice__page'>
        {loader ?
          <div className='page-loader__container'>
            <div className='plc__animation'></div>
          </div>
        :
          <div className='pi__container'>
            <InvoicePreview 
              invoiceData={invoiceData}
            />
          </div>
        }
      </div>
    );
};

export default ViewInvoice;