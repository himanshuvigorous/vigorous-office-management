import React, { useEffect, useState } from "react";
import { inputClassName } from "../../../constents/global";
import CryptoJS from "crypto-js";
import { FaCheckDouble, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  companyRazorPayfunc,
  getCompanyDetails,
  verifyAuthFunc,
} from "./companyFeatures/_company_reducers";
import { Button, Input, Modal } from "antd";
import { useForm } from "react-hook-form";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";

function Razorpaykeys({ companyDetailsData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [showKeys, setShowKeys] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const DATA_ENCRYPT_DCRYPT_KEY = "12345678901234567890123456789012";

  const dataEncrypt = (text) =>
    CryptoJS.AES.encrypt(text, DATA_ENCRYPT_DCRYPT_KEY).toString();

  const dataDecrypt = (text) => {
    if (!text) return "";
    const bytes = CryptoJS.AES.decrypt(text, DATA_ENCRYPT_DCRYPT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    if (companyDetailsData?.data) {
      const keys = companyDetailsData.data.razorpayKey;
      setValue("primaryRazoypayKey", showKeys ? dataDecrypt(keys?.privateKey) : keys?.privateKey);
      setValue("secretKeyrazorpay", showKeys ? dataDecrypt(keys?.secretKey) : keys?.secretKey);
    }
  }, [companyDetailsData, showKeys]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    const result = await dispatch(verifyAuthFunc({ password: currentPassword }));
    if (!result?.error) {
      setShowKeys(true);
      setPasswordModalOpen(false);
      setCurrentPassword("");
      setError("");
      const keys = companyDetailsData.data.razorpayKey;
      setValue("primaryRazoypayKey", dataDecrypt(keys?.privateKey));
      setValue("secretKeyrazorpay", dataDecrypt(keys?.secretKey));
    } else {
      setError("Password verification failed.");
    }
  };

  const handleSave = (data) => {
    if (!showKeys) {
      showNotification({
        message: "Please authenticate to view and edit keys",
        type: "error",
      });
      return;
    }

    const payload = {
      privateKey: dataEncrypt(data?.primaryRazoypayKey),
      secretKey: dataEncrypt(data?.secretKeyrazorpay),
    };

    dispatch(companyRazorPayfunc(payload)).then((res) => {
      if (!res.error) {
        dispatch(getCompanyDetails({ _id: companyDetailsData?.data?._id }));
        setShowKeys(false);
        showNotification({ message: "Keys updated successfully", type: "success" });
      }
    });
  };

  return (
    <>
      <div className="px-3 grid grid-cols-1 gap-4 items-end mb-3">
        <div className="border border-gray-300 pb-2 rounded-sm">
          <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-2">
            <div className="px-3 py-2 text-white font-semibold">Razorpay Keys</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="text-white px-2 py-1"
              >
                {showKeys ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                onClick={handleSubmit(handleSave)}
                className="text-white px-2 py-1"
              >
                <FaCheckDouble />
              </button>
            </div>
          </div>

          <div className="relative px-2 mb-3">
            <input
              type={showKeys ? "text" : "password"}
              {...register("primaryRazoypayKey")}
              className={`${inputClassName}`}
              placeholder="Enter Primary Key"
            />
            {errors.primaryRazoypayKey && (
              <p className="text-red-500 text-sm">{errors.primaryRazoypayKey.message}</p>
            )}
          </div>

          <div className="relative px-2">
            <input
              type={showKeys ? "text" : "password"}
              {...register("secretKeyrazorpay")}
              className={`${inputClassName}`}
              placeholder="Enter Secret Key"
            />
            {errors.secretKeyrazorpay && (
              <p className="text-red-500 text-sm">{errors.secretKeyrazorpay.message}</p>
            )}
          </div>
        </div>
      </div>

      <Modal
     
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          setCurrentPassword("");
          setError("");
        }}
        footer={null}
        centered
        destroyOnClose
        maskClosable
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        className="password-modal antmodalclassName"
      >
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-black">
            Current Password
          </label>
          <Input.Password
            id="current-password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
        <Button
          type="primary"
          onClick={handlePasswordSubmit}
          block
          className="mt-4"
          style={{ backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" }}
        >
          Submit
        </Button>
      </Modal>
    </>
  );
}

export default Razorpaykeys;
