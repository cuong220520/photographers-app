import React, { useEffect, Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import { getProfiles, searchProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'

const Profile = ({ getProfiles, profile: { profiles, loading }, searchProfiles }) => {
  const [term, setTerm] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    if (!!term) {
      searchProfiles({ term })
    } else {
      getProfiles()
    }
  }

  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Photographers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and connect with
            Photographers
          </p>

          <form className='form' onSubmit={(event) => onSubmit(event)}>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Enter username, skill or address (search by skills put term in "[]" and separate by ",")'
                name='term'
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                }}
              />
            </div>

            <input type='submit' className='btn btn-primary' value='Search' />
          </form>

          <br />

          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile, key) => (
                <ProfileItem key={key} profile={profile} />
              ))
            ) : (
              <h4>No profile found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Profile.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  searchProfiles: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
})

export default connect(mapStateToProps, { getProfiles, searchProfiles })(Profile)
