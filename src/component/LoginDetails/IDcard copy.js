import { Button, Modal, Spin } from 'antd';
import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';
import IDCardLayout from './IDCardlayout';

const IDcard = ({ idCardModal, setIcardModal, onBoardingDetailsData, OnBoardingLoading }) => {
  const cardRef = useRef(null);

  // Preload Images
  useEffect(() => {
    if (!idCardModal || !onBoardingDetailsData) return;

    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };

    const base = process.env.REACT_APP_BACKEND_DOMAIN_NAME;
    preload(`${base}/public/${onBoardingDetailsData?.profileImage}`);
    preload(`${base}/public/${onBoardingDetailsData?.companyProfileImg}`);
  }, [idCardModal, onBoardingDetailsData]);

  const downloadIDCard = async () => {
    const el = cardRef.current;
    if (!el) return;
    

    try {
       await document.fonts.ready;
       await new Promise((res) => setTimeout(res, 300));
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `${onBoardingDetailsData?.fullName || 'employee'}_id_card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating ID card:', error);
    }
  };

  return (
    <>
      <Modal
        title="Employee ID Card"
        open={idCardModal}
        onCancel={() => setIcardModal(false)}
        footer={[
          // <Button key="download" type="primary" onClick={downloadIDCard}>
          //   Download
          // </Button>,
          <Button key="cancel" onClick={() => setIcardModal(false)}>
            Close
          </Button>,
        ]}
      >
        {OnBoardingLoading ? (
          <Spin />
        ) : (
          <IDCardLayout onBoardingDetailsData={onBoardingDetailsData} cardRef={cardRef} />
        )}
      </Modal>
    </>
  );
};

export default IDcard;
