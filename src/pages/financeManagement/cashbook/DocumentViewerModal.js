import React, { useState } from 'react';
import { Modal, Image } from 'antd';
import { 
  FaFilePdf, 
  FaFileExcel, 
  FaFileWord, 
  FaFileAlt, 
  FaDownload,
  FaTimes
} from 'react-icons/fa';

export const DocumentViewerModal = ({ isOpen, onClose, employeeName, attachments }) => {
  // Helper functions to determine file types
  const isImage = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const ext = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const isPDF = (filename) => {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  };

  const isExcel = (filename) => {
    if (!filename) return false;
    const excelExtensions = ['xls', 'xlsx', 'csv'];
    const ext = filename.split('.').pop().toLowerCase();
    return excelExtensions.includes(ext);
  };

  const isWord = (filename) => {
    if (!filename) return false;
    const wordExtensions = ['doc', 'docx'];
    const ext = filename.split('.').pop().toLowerCase();
    return wordExtensions.includes(ext);
  };

  // Get appropriate icon for file type
  const getFileIcon = (filename) => {
    if (isImage(filename)) return <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
      <span className="text-blue-600 font-semibold">IMG</span>
    </div>;
    if (isPDF(filename)) return <FaFilePdf className="text-red-600 text-3xl" />;
    if (isExcel(filename)) return <FaFileExcel className="text-green-600 text-3xl" />;
    if (isWord(filename)) return <FaFileWord className="text-blue-600 text-3xl" />;
    return <FaFileAlt className="text-gray-600 text-3xl" />;
  };

  // Get file type label
  const getFileType = (filename) => {
    if (isImage(filename)) return 'Image';
    if (isPDF(filename)) return 'PDF';
    if (isExcel(filename)) return 'Excel';
    if (isWord(filename)) return 'Word';
    return 'File';
  };

  // Handle file actions based on type
  const handleFileAction = (file) => {
    // In a real app, this would be your backend URL
    const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;
    
    if (isImage(file)) {
      // Images will be shown in the previewer, no action needed
      return;
    } else if (isPDF(file)) {
      // PDFs open in new tab
      window.open(url, '_blank');
    } else {
      // Other files trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Format file name for display
  const formatFileName = (name) => {
    if (name.length > 20) {
      return `${name.substring(0, 15)}...${name.split('.').pop()}`;
    }
    return name;
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">
            Attached Docs For {employeeName || 'Employee'}
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      }
      width={800}
      footer={null}
      open={isOpen}
      onCancel={onClose}
      closable={false}
      className="rounded-lg overflow-hidden"
    >
      <div className="my-6">
        {attachments && attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((file, index) => {
              // In a real app, this would be your backend URL
              const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`;
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleFileAction(file)}
                  >
                    <div className="relative mb-3">
                      {isImage(file) ? (
                        <div className="w-24 h-24 overflow-hidden rounded-lg border">
                          <Image
                            width={96}
                            height={96}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                            preview={{
                              src: url,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg border">
                          {getFileIcon(file)}
                        </div>
                      )}
                      
                      {!isImage(file) && (
                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                          {isPDF(file) ? (
                            <span className="text-xs font-medium text-gray-700">View</span>
                          ) : (
                            <FaDownload className="text-gray-700 text-sm" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {formatFileName(file)}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                        {getFileType(file)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 text-5xl mb-4">
              <FaFileAlt />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No files attached</h3>
            <p className="text-gray-500">There are no documents to display</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
