import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { setAlert } from '../../actions/alert'

const Register = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const { name, email, password, confirmPassword } = formData

    const onChange = (event) =>
        setFormData({ ...formData, [event.target.name]: event.target.value })

    const onSubmit = (event) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setAlert('Password does not match', 'danger')
        } else {
            console.log('Success')
        }
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
                        required
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
                        This site uses Gravatar so if you want a profile image,
                        use a Gravatar email
                    </small>
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        minLength='6'
                        value={password}
                        onChange={(event) => onChange(event)}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        minLength='6'
                        value={confirmPassword}
                        onChange={(event) => onChange(event)}
                    />
                </div>
                <input
                    type='submit'
                    className='btn btn-primary'
                    value='Register'
                />
            </form>
            <p className='my-1'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
}

export default connect(null, { setAlert })(Register)
