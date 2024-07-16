import { uploadFile } from '@/services/common';
import { fullFileUrl } from '@/utils/shared';
import { PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload } from 'antd';
import { useState } from 'react';

const PREVIEW_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
};

const ACCEPT_IMAGE_SUFFIX = ['jpg', 'png', 'gif', 'webp'];
const ACCEPT_VIDEO_SUFFIX = ['mp4'];

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const FileUpload = ({
  maxCount = 1,
  listType = 'picture',
  accept = '',
  onChange,
  relationId,
  fileList = [],
  ...rest
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [delIds, setDelIds] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    const extName = file?.url?.split('.').pop();

    if (ACCEPT_IMAGE_SUFFIX.includes(extName)) {
      setPreviewType(PREVIEW_TYPE.IMAGE);
    }

    if (ACCEPT_VIDEO_SUFFIX.includes(extName)) {
      setPreviewType(PREVIEW_TYPE.VIDEO);
    }

    setPreviewUrl(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = (info) => {
    const { file, fileList: newFileList } = info;
    setDelIds((prevDelIds) => {
      onChange?.(newFileList, prevDelIds);
      return prevDelIds;
    });
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
    setDelIds((prevDelIds) => {
      const updatedDelIds = [...prevDelIds, file.fileId];
      onChange?.(updatedFileList, updatedDelIds);
      return updatedDelIds;
    });
  };

  const customRequest = async (info) => {
    const { onProgress, onError, onSuccess, file } = info;

    const formData = new FormData();
    formData.append('file', file);
    if (relationId) {
      formData.append('relationId', relationId);
    }

    try {
      const res = await uploadFile(formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.({ percent: percentCompleted });
          }
        },
      });

      if (res) {
        const url = fullFileUrl(res.fileUrl);
        const updatedFile = Object.assign(file, { fileId: res.fileId, url });
        const updatedFileList = fileList.map((item) =>
          item.uid === file.uid ? updatedFile : item,
        );
        onSuccess?.(url, file);
        // message.success(`${file.name} 文件上传成功`);
        handleChange({ file: updatedFile, fileList: updatedFileList });
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error);
      message.error(`${file.name} 文件上传失败`);
    }
  };

  return (
    <>
      <Upload
        accept={accept}
        fileList={fileList}
        listType={listType}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        customRequest={customRequest}
        multiple={maxCount > 1}
        {...rest}
      >
        {fileList.length < maxCount && (
          <button
            style={{
              border: 0,
              background: 'none',
            }}
            type="button"
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传照片</div>
          </button>
        )}
      </Upload>
      {previewType === PREVIEW_TYPE.IMAGE && (
        <Image
          src={previewUrl}
          style={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            src: previewUrl,
            onVisibleChange: (value) => {
              setPreviewOpen(value);
            },
          }}
        />
      )}
    </>
  );
};

export default FileUpload;
