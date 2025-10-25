import CryptoJS from "crypto-js";


export const encrypt = (text) => {
  const str = String(text); 
  const encrypted = CryptoJS.AES.encrypt(str, process.env.REACT_APP_SECRET_KEY).toString();
  return encodeURIComponent(encrypted); 
};

export const decrypt = (encryptedText) => {
  try {
    const decodedText = decodeURIComponent(encryptedText); 
    const bytes = CryptoJS.AES.decrypt(decodedText, process.env.REACT_APP_SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8); 

    if (!decryptedText) {
      throw new Error("Decryption failed or resulted in empty string");
    }

    return decryptedText; 
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return null; 
  }
};


export const encryptObject = (data) => {
  const jsonString = JSON.stringify(data); 
  const encrypted = CryptoJS.AES.encrypt(jsonString, process.env.REACT_APP_SECRET_KEY).toString(); 
  return encodeURIComponent(encrypted);
};


export const decryptObject = (encryptedText) => {
  try {
    const decodedText = decodeURIComponent(encryptedText); 
    const bytes = CryptoJS.AES.decrypt(decodedText, process.env.REACT_APP_SECRET_KEY); 
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8); 

    if (!decryptedText) {
      throw new Error("Decryption failed or resulted in empty string");
    }

    const dataObject = JSON.parse(decryptedText); 
    return dataObject; 
  } catch (error) {
    console.error("Error during decryption:", error.message); 
    return null; 
  }
};