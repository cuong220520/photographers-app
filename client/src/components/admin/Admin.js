import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import { deleteUser, getAllUsers } from '../../actions/user'
import {
  getCurrentProfile,
  deleteAccount,
  getSkillCounts,
} from '../../actions/profile'
import PieChart from './PieChart'

const Admin = ({
  auth: { user },
  getSkillCounts,
  getAllUsers,
  users,
  profile: { profileCount, loading },
  deleteUser
}) => {
  useEffect(() => {
    getAllUsers()
    getSkillCounts()
    // eslint-disable-next-line
  }, [])

  const deleteUserById = (id) => {
    deleteUser(id)
  }

  return !user || loading || !profileCount ? (
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
                <th className='hide-sm'>Role</th>
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
                    <td>{user.role}</td>
                    {user.role !== 'admin' && (
                      <td>
                        <button
                          className='btn btn-danger'
                          onClick={() => deleteUserById(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          <PieChart
            skillCounts={profileCount.skillCounts}
            totalCount={profileCount.totalCount}
          />
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
  getSkillCounts: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
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
  getSkillCounts,
  deleteUser
})(Admin)
