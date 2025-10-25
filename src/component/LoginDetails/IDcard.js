import { Button, Modal, Spin } from 'antd';
import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';
import IDCardLayout from './IDCardlayout';
import { htmlTemplateGenerator } from '../../pages/financeManagement/invoice/invoiceFeature/_invoice_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName } from '../../constents/global';

const IDcard = ({ idCardModal, setIcardModal, onBoardingDetailsData, OnBoardingLoading }) => {
  const cardRef = useRef(null);
   
  const iframeRef = useRef(null);

  const dispatch = useDispatch();
  const { htmlTemplateGeneratorDetails } = useSelector((state) => state.invoice);




  
    useEffect(() => {
      if (iframeRef.current && htmlTemplateGeneratorDetails?.html) {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlTemplateGeneratorDetails.html);
        iframeDoc.close();
        addPrintStyles(iframeDoc);
      }
    }, [htmlTemplateGeneratorDetails]);
  
    
    const addPrintStyles = (iframeDoc) => {
      const style = iframeDoc.createElement("style");
      style.textContent = `
        @page {
          margin: 0 !important;   /* Remove default print margins */
          size: auto;             /* Auto size based on content */
        }
    
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background: transparent !important;
        }
    
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: fit-content !important;   /* shrink to content */
            height: fit-content !important;
          }
        }
      `;
      iframeDoc.head.appendChild(style);
    };
    
  
    const handlePrint = () => {
      if (iframeRef.current) {
        const iframeWindow = iframeRef.current.contentWindow;
  
        // Wait for iframe to fully load before printing
        iframeWindow.onload = () => {
          iframeWindow.focus();
  
          // Some browsers need a small delay before printing
          setTimeout(() => {
            iframeWindow.print();
          }, 200);
        };
  
        // Trigger load event if already loaded
        if (iframeWindow.document.readyState === 'complete') {
          iframeWindow.onload();
        }
      }
    };

  return (
    <>
      <Modal
        title="Employee ID Card"
        open={idCardModal}
        onCancel={() => setIcardModal(false)}
        footer={[
         
          <Button key="cancel" onClick={() => setIcardModal(false)}>
            Close
          </Button>,
        ]}
      >
        <button
        onClick={handlePrint}
        style={{
          margin: '10px',
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Print PDF
      </button>

      

      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          minHeight: '70vh',
          border: 'none',
          // boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
          scrollbarWidth: 'none',
          backgroundColor: 'transparent'
        }}
        title="Invoice Preview"
      />
      </Modal>
    </>
  );
};

export default IDcard;
