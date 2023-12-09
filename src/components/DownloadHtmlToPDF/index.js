import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadHTMLToPDFFile = (divisionID, WidthOfPdf, fileName) => {
    const element = document.getElementById(`${divisionID}`);
    // Set the width of the content container to 600 pixels
    element.style.width = `${WidthOfPdf}px`;
    const options = {
        scale: 2, // Increase scale for higher resolution
        width: 600, // Set the desired maximum width
        useCORS: true, // Enable Cross-Origin Resource Sharing for external images
    };

    html2canvas(element, options).then(canvas => {
        const aspectRatio = canvas.width / canvas.height;

        const pdf = new jsPDF({
            orientation: aspectRatio > 1 ? 'landscape' : 'portrait', // Set orientation based on aspect ratio
            unit: 'mm', // Use millimeters as the unit of measurement
            format: [190, 190 / aspectRatio], // Set PDF size based on aspect ratio
        });

        const image = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG format with maximum quality
        pdf.addImage(image, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

        // Reset the width of the content container after generating the PDF
        element.style.width = 'auto';

        //change name of PDF file
        pdf.save(fileName);
    });
}

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
        reader.onerror = reject;
    });
};

export const generatePDFBlobAndConvertToBase64 = async (divisionID, WidthOfPdf) => {
    const element = document.getElementById(`${divisionID}`);
    // Set the width of the content container to the specified width
    element.style.width = `${WidthOfPdf}px`;
    const options = {
        scale: 2, // Increase scale for higher resolution
        width: 600, // Set the desired maximum width
        useCORS: true, // Enable Cross-Origin Resource Sharing for external images
    };

    const canvas = await html2canvas(element, options);
    const aspectRatio = canvas.width / canvas.height;

    const pdf = new jsPDF({
        orientation: aspectRatio > 1 ? 'landscape' : 'portrait', // Set orientation based on aspect ratio
        unit: 'mm', // Use millimeters as the unit of measurement
        format: [190, 190 / aspectRatio], // Set PDF size based on aspect ratio
    });

    const image = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG format with maximum quality
    pdf.addImage(image, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

    // Reset the width of the content container after generating the PDF
    element.style.width = 'auto';

    // Convert the PDF blob to a base64 string
    const pdfBlob = pdf.output('blob');
    const base64PDF = await blobToBase64(pdfBlob);

    return base64PDF; // Return the base64 string of the generated PDF
};