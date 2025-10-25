import React from "react";
import { Image } from "antd";

function CommonImageViewer({ src, alt, key }) {
  const isPdf = src?.includes("pdf");

  const handleImageClick = () => {
    if (isPdf) {
      // Open the PDF in a new tab
      window.open(src, "_blank");
    }
  };

  if (isPdf) {
    return (
      <div onClick={handleImageClick} style={{ cursor: "pointer" }}>
        <Image
          key={key}
          width={"80px"}
          height={"80px"}
          preview={false}
          maskClassName="custom-mask-image"
          src="\images\pdf-placeholder.svg" 
          alt={alt}
        />
      </div>
    );
  } else {
    return (
      <Image
        key={key}
        width={"80px"}
        height={"80px"}
        maskClassName="custom-mask-image"
        src={src}
        alt={alt}
      />
    );
  }
}

export default CommonImageViewer;
