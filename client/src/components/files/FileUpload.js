import React, { useState } from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'

const FileUpload = ({ refreshFunction }) => {
  const [images, setImages] = useState([])

  const onDrop = async (files) => {
    const formData = new FormData()

    formData.append('file', files[0])

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    try {
      const res = await axios.post(
        '/api/post/upload-image',
        formData,
        config
      )
      console.log(images)

      setImages([res.data.filePath, ...images])
      refreshFunction([res.data.filePath])
    } catch (err) {
      console.error(err)
    }
  }

  const onDelete = (image) => {
    const currentIndex = images.indexOf(image)

    let newImages = [...images]
    newImages.splice(currentIndex, 1)

    setImages(newImages)
    refreshFunction(newImages)
  }

  return (
    <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div>
            {images.map((image, index) => (
              <div onClick={() => onDelete(image)} key={index}></div>
            ))}
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default FileUpload
