import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { addPost } from '../../actions/post'
import FileUpload from '../files/FileUpload'

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('')
  const [images, setImages] = useState([])

  const uploadImage = (newImage) => {
    setImages((prevState) => prevState.concat(newImage))
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>What are you thinking?</h3>
      </div>
      <header className='form-header'>
        {images && images.length > 0 && (
          <div className='uploaded-images-container'>
            {images.map((image, key) => (
              <img className='uploaded-image-sm' key={key} src={`${image}`} />
            ))}
          </div>
        )}<br />
        <label style={{ padding: '1rem' }}>
          <FileUpload refreshFunction={uploadImage} />
          <i className='fas fa-edit fa-2x' />
        </label>
        <h3 className='edit-profile__username'></h3>
      </header>
      <form
        className='form my-1'
        onSubmit={(event) => {
          event.preventDefault()
          addPost({ text, images })
          setText('')
          setImages([])
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(event) => setText(event.target.value)}
        ></textarea>
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
}

export default connect(null, { addPost })(PostForm)
