import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  })

  const { name, email, password, confirmPassword, role } = formData

  const onChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value })

  const onSubmit = (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setAlert('Password does not match', 'danger')
    } else {
      register({ name, email, password, role })
    }
  }

  // redirect if register successfully
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(event) => onSubmit(event)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(event) => onChange(event)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(event) => onChange(event)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(event) => onChange(event)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(event) => onChange(event)}
          />
        </div>
        <div className='form-group'>
          <select
            name='role'
            value={role}
            onChange={(event) => onChange(event)}
          >
            <option disabled={false}>Choose role</option>
            <option value='user'>User</option>
            <option value='photographer'>Photographer</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { setAlert, register })(Register)
