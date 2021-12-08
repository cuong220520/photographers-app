import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import { getAllUsers } from '../../actions/user'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'

const Admin = ({ auth: { user }, deleteAccount, getAllUsers, users }) => {
  useEffect(() => {
    getAllUsers()
  }, [])
  return !user ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> {'  '}
        Welcome admin: {user && user.name}
      </p>

      <Fragment>
        <Fragment>
          <h2 className='my-2'>Users management</h2>
          <table className='table'>
            <thead>
              <tr>
                <th>No</th>
                <th className='hide-sm'>Email</th>
                <th className='hide-sm'>Name</th>
                <th className='hide-sm'>Posts</th>
                <th className='hide-sm'>Likes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users &&
                users.length > 0 &&
                users.map((user, key) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>3</td>
                    <td>5</td>
                    <td>
                      <button className='btn btn-danger'>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Fragment>
      </Fragment>
    </Fragment>
  )
}

Admin.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  users: state.user.users,
})

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteAccount,
  getAllUsers,
})(Admin)
