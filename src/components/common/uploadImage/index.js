import React, { useEffect, useState } from 'react'
import { Image, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useUploadImageMutation } from '@src/redux/endPoint/upload'
import Notification from '../notification'

const UploadImage = ({ setData, getDataFn, onChange, value }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (setData) {
      setFileList([
        {
          uid: setData,
          name: setData,
          status: 'done',
          url: `${process.env.PUBLIC_IMAGE_API_BASE_URL}${setData}`
        }
      ])
      getDataFn(setData)
    }
  }, [setData])

  const handlePreview = async file => {
    if (file.url) {
      setPreviewImage(file.url)
    } else {
      if (!file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      setPreviewImage(file.preview)
    }
    setPreviewOpen(true)
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    if (newFileList?.[0]?.response?.status === 200) {
      getDataFn(newFileList?.[0]?.response?.metadata?.[0])
    } else {
      handleError(newFileList?.[0]?.response?.status)
    }
  }
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  )

  const handleError = status => {
    switch (status) {
      case 400:
        return Notification('error', 'Upload image', 'Failed upload file')
      case 500:
        return Notification('error', 'Upload image', 'Failed call api')
    }
  }

  return (
    <>
      <Upload
        action={'http://localhost:3055/v1/api/upload'}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none'
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </>
  )
}

export default UploadImage
