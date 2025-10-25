import { Upload, Button, Image, Popconfirm } from "antd";
import { LoadingOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fileUploadFunc } from "../../pages/global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { ProfileImageUpdate } from "../../redux/_reducers/_auth_reducers";

const ImageUploader = ({ onUploadSuccess, buttonText = "Upload Image", imageSize = 100, setValue, field, updateProfilePicture = false, userId, error = null }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();


  const handleUpload = async (file) => {
    try {
      setLoading(true);
      const response = await dispatch(fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      }))

      if (response?.payload?.data) {
        const uploadedUrl = response.payload?.data;
        if (field) field.onChange(uploadedUrl);
        if (onUploadSuccess) onUploadSuccess(uploadedUrl);
      }
      if (updateProfilePicture) {
        if (!response.error) {
          const data = await dispatch(
            ProfileImageUpdate({
              _id: userId,
              imagePath: response?.payload?.data,
            })
          ).then(() => {
            if (field) field.onChange(response?.payload?.data);
            if (inputRef.current) inputRef.current.value = ''
          })

        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemoveImage = () => {
    if (field) field.onChange(null);
    if (inputRef.current) inputRef.current.value = "";
    dispatch(ProfileImageUpdate({
      _id: userId,
      imagePath: '',
    })).then(() => {
      if (field) field.onChange('');
      if (inputRef.current) inputRef.current.value = ''
    })
  };

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={{ position: "relative", width: imageSize, height: imageSize }}>
        {field?.value ? (
          <>
            {/* Image Preview */}
            <Image
              preview={false}

              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${field.value}`}
              className="rounded-full"
              alt="Uploaded image preview"
              width={imageSize}
              height={imageSize}
              style={{ objectFit: "cover", cursor: "pointer" }}
              onClick={handleImageClick}
            />


            <Popconfirm
              title="What would you like to do?"
              onConfirm={
                (e) => {
                  e?.stopPropagation();
                  handleImageClick()
                }
              }
              onCancel={
                (e) => {
                  e?.stopPropagation();
                  handleRemoveImage()
                }
              }
              okText="Change Image"
              cancelText="Delete"
              okButtonProps={{ type: 'primary' }}
              cancelButtonProps={{ danger: true }}
              placement="top"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Button
                type="primary"
                // icon={}
                shape="circle"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}
                onClick={(e) => e.stopPropagation()}
              ><EditOutlined className="text-header" /></Button>
            </Popconfirm>
          </>
        ) : (
          <div
            onClick={handleImageClick}
            className="flex flex-col justify-center items-center rounded-full cursor-pointer hover:shadow-md"
            style={{
              border: "2px dashed #d9d9d9",
              width: imageSize,
              height: imageSize,
              backgroundColor: "#fafafa",
              position: "relative",
            }}
          >
            <PlusOutlined style={{ fontSize: 24 }} />
            <span style={{ fontSize: 12, marginTop: 4 }}>{buttonText}</span>
          </div>
        )}

        {/* 🔄 Loader Overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: imageSize,
              height: imageSize,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              zIndex: 3,
            }}
          >
            <LoadingOutlined style={{ fontSize: 24 }} />
          </div>
        )}
      </div>
        {error && (
          <div className="absolute -bottom-5 w-full text-nowrap text-center left-0 right-0 text-red-500 text-xs">
            {error.message}
          </div>
        )}
    </div>
  );

};

export default ImageUploader;
