import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decrypt } from '../../../config/Encryption';
import { useDispatch, useSelector } from 'react-redux';
import { htmlTemplateGenerator } from './invoiceFeature/_invoice_reducers';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';

const ViewInvoice = () => {
  const iframeRef = useRef(null);
  const [searchParams] = useSearchParams();
  const invoiceIdDec = decrypt(searchParams.get('invoiceId'));
  const downloadPdfPath = decrypt(searchParams.get('downloadPdfPath'));
  const type = searchParams.get('type') || '';
  const dispatch = useDispatch();
  const { htmlTemplateGeneratorDetails } = useSelector((state) => state.invoice);

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    if (iframeRef.current && htmlTemplateGeneratorDetails?.html) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlTemplateGeneratorDetails?.html);
      iframeDoc.close();

      // Add responsive print styles to the iframe
      addPrintStyles(iframeDoc);
    }
  }, [htmlTemplateGeneratorDetails]);

  const fetchDetails = () => {
    dispatch(htmlTemplateGenerator({ _id: invoiceIdDec, type }));
  };

  const addPrintStyles = (iframeDoc) => {
    const style = iframeDoc.createElement('style');
    style.textContent = `
      @page {
        size: auto;
        margin: 0mm;
      }
      
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
        
        /* Force A4 size for desktop */
        @media (min-width: 768px) {
          body {
            width: 210mm !important;
            height: 297mm !important;
          }
        }
        
        /* Mobile-specific print styles */
        @media (max-width: 767px) {
          body {
            width: 100% !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Add any mobile-specific adjustments here */
          table {
            width: 100% !important;
            font-size: 12px !important;
          }
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
    <GlobalLayout>
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

      <button
        onClick={() => {
          const elementpath = downloadPdfPath || ""
          if (elementpath) {
            const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${elementpath}`;
            const link =
              document.createElement("a");
            link.href = pdfLink;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }}
        className='bg-header'
        style={{
          margin: '10px',
          padding: '8px 16px',

          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Download PDF
      </button>

      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          minHeight: '150vh',
          border: 'none',
          // boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
          scrollbarWidth: 'none',
          backgroundColor: 'transparent'
        }}
        title="Invoice Preview"
      />
    </GlobalLayout>
  );
};

export default ViewInvoice;