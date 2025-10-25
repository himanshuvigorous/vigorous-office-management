import React, { useState } from 'react';
import { Modal, Button, Row, Col, List, Typography, Empty, Tooltip } from 'antd';
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileAlt,
  FaFile,
  FaEye,
  FaTh,
  FaList,
} from 'react-icons/fa';
import { AppstoreOutlined, BarsOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FileViewerModal = ({
  visible,
  onCancel,
  fileData = [],
  domain,
}) => {
  const [viewMode, setViewMode] = useState('grid');

  const getFileExtension = (filename) => filename.split('.').pop().toLowerCase();

  const getFileType = (filename) => {
    const ext = getFileExtension(filename);
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    if (['ppt', 'pptx'].includes(ext)) return 'powerpoint';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    if (['zip', 'rar', '7z'].includes(ext)) return 'archive';
    if (['txt', 'text'].includes(ext)) return 'text';
    return 'other';
  };

  const getFileIcon = (fileType) => {
  const size = 32;
  switch (fileType) {
    case 'pdf':
      return <FaFilePdf size={size} color="#e74c3c" />;
    case 'word':
      return <FaFileWord size={size} color="#3498db" />;
    case 'excel':
      return <FaFileExcel size={size} color="#27ae60" />;
    case 'powerpoint':
      return <FaFilePowerpoint size={size} color="#e67e22" />;
    case 'image':
      return <FaFileImage size={size} color="#8e44ad" />;
    case 'video':
      return <FaFileVideo size={size} color="#9b59b6" />;
    case 'audio':
      return <FaFileAudio size={size} color="#f1c40f" />;
    case 'archive':
      return <FaFileArchive size={size} color="#7f8c8d" />;
    case 'text':
      return <FaFileAlt size={size} color="#95a5a6" />;
    default:
      return <FaFile size={size} color="#bdc3c7" />;
  }
};

  const handleFileClick = (filePath) => {
    const fileUrl = `${domain}/${filePath}`;
    window.open(fileUrl, '_blank');
  };

  const renderGridItem = (filePath, index) => {
    const fileType = getFileType(filePath);
    const fileName = filePath.split('/').pop();
    const fileUrl = `${domain}/${filePath}`;

    if (fileType === 'image') {
      return (
        <Col span={8} key={index}>
          <div
            onClick={() => handleFileClick(filePath)}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              padding: 8,
              textAlign: 'center',
            }}
          >
            <img
              src={fileUrl}
              alt={fileName}
              style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }}
            />
            <Text ellipsis style={{ display: 'block', marginTop: 8 }}>{fileName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{getFileExtension(fileName).toUpperCase()}</Text>
          </div>
        </Col>
      );
    }

    return (
      <Col span={8} key={index}>
        <div
          onClick={() => handleFileClick(filePath)}
          style={{
            border: '1px solid #f0f0f0',
            padding: 16,
            borderRadius: 8,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div>{getFileIcon(fileType)}</div>
          <Text ellipsis style={{ display: 'block', marginTop: 8 }}>{fileName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{getFileExtension(fileName).toUpperCase()}</Text>
        </div>
      </Col>
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={`Attachments (${fileData.length})`}
      width={900}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Tooltip title="Grid View">
          <Button
            icon={<AppstoreOutlined />}
            type={viewMode === 'grid' ? 'primary' : 'default'}
            onClick={() => setViewMode('grid')}
            style={{ marginRight: 8 }}
          />
        </Tooltip>
        <Tooltip title="List View">
          <Button
            icon={<BarsOutlined />}
            type={viewMode === 'list' ? 'primary' : 'default'}
            onClick={() => setViewMode('list')}
          />
        </Tooltip>
      </div>

      {fileData.length === 0 ? (
        <Empty description="No attachments available" />
      ) : viewMode === 'grid' ? (
        <Row gutter={[16, 16]}>
          {fileData.map((filePath, index) => renderGridItem(filePath, index))}
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={fileData}
          renderItem={(filePath, index) => {
            const fileType = getFileType(filePath);
            const fileName = filePath.split('/').pop();

            return (
              <List.Item onClick={() => handleFileClick(filePath)} style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={getFileIcon(fileType)}
                  title={<Text strong>{fileName}</Text>}
                  description={`${getFileExtension(fileName).toUpperCase()} file`}
                />
                <div style={{ color: '#1890ff' }}>
                  <EyeOutlined style={{ marginRight: 4 }} />
                  Open
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default FileViewerModal;
