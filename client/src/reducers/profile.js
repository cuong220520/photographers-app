import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  COUNT_PROFILE,
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
  profileCount: {},
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
        error: {},
      }

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
        error: {},
      }

    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
        error: {},
      }

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      }

    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
        error: {},
      }

    case COUNT_PROFILE:
      return {
        ...state,
        loading: false,
        error: {},
        profileCount: payload,
      }

    default:
      return state
  }
}
