import { GET_USERS, GET_USER, USER_ERROR, DELETE_USER } from './types'
import axios from 'axios'

import { setAlert } from './alert'

export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users/all')

    console.log(res)

    dispatch({
      type: GET_USERS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const deleteUser = (id) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete(`/api/users/${id}`)

      dispatch({
        type: DELETE_USER,
      })

      dispatch(setAlert('User deleted', 'success'))

      dispatch(getAllUsers())
    } catch (err) {
      dispatch({
        type: USER_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      })
    }
  }
}

export const getUserById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/${id}`)

    dispatch({
      type: GET_USER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}
