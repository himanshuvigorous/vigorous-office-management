import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BiDownload } from 'react-icons/bi';
import IDCardlayout from '../../../component/LoginDetails/IDCardlayout';
import ReactDOM from 'react-dom/client';
import { jsPDF } from 'jspdf';

const OnboardingZipDownload = ({ onboardingList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadType, setDownloadType] = useState('images'); // 'images' or 'pdfs'

  const handleDownloadAll = async () => {
    if (!onboardingList?.length) return;
    
    setIsLoading(true);
    const zip = new JSZip();

    for (let i = 0; i < onboardingList.length; i++) {
      const entry = onboardingList[i];

      // Create an off-screen container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Render the ID card component
      const root = ReactDOM.createRoot(container);
      root.render(
        <div style={{ display: 'inline-block' }}>
          <IDCardlayout onBoardingDetailsData={entry} />
        </div>
      );

      // Wait for rendering and image loading
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Get the actual dimensions of the rendered card
        await new Promise(resolve => setTimeout(resolve, 100));
        const cardElement = container.firstChild;

        if (downloadType === 'images') {
          // Download as PNG
          const canvas = await html2canvas(cardElement, {
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardElement.scrollWidth,
            windowHeight: cardElement.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png', 1.0);
          zip.file(`IDCard_${entry?.fullName || `user_${i}`}.png`, imgData.split(',')[1], {
            base64: true,
          });
        } else {
          // Download as PDF
          const canvas = await html2canvas(cardElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardElement.scrollWidth,
            windowHeight: cardElement.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [canvas.width, canvas.height]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          const pdfData = pdf.output('blob');
          zip.file(`IDCard_${entry?.fullName || `user_${i}`}${i}.pdf`, pdfData);
        }
      } catch (error) {
        console.error(`Error generating card for ${entry?.fullName}:`, error);
      } finally {
        // Clean up
        root.unmount();
        document.body.removeChild(container);
      }
    }

    // Generate and download the zip
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `All_ID_Cards_${downloadType}.zip`);
    } catch (error) {
      console.error('Error generating zip file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={() => setDownloadType('images')}
          className={`px-2 py-1 rounded-md text-xs ${downloadType === 'images' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Download as Images
        </button>
        <button
          onClick={() => setDownloadType('pdfs')}
          className={`px-2 py-1 rounded-md text-xs ${downloadType === 'pdfs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Download as PDFs
        </button>
      </div>
      
      <button
        onClick={handleDownloadAll}
        disabled={isLoading || !onboardingList?.length}
        className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white disabled:opacity-50"
      >
        <BiDownload />
        <span className="text-[12px]">
          {isLoading ? 'Downloading...' : `Download All ID Cards (${downloadType})`}
        </span>
      </button>
    </div>
  );
};

export default OnboardingZipDownload;