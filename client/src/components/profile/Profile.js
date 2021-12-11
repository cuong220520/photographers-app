import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import { getProfileById } from '../../actions/profile'
import { getPostsByUser } from '../../actions/post'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import PostItem from '../posts/PostItem'

const Profile = ({
  profile: { profile, loading },
  auth,
  getProfileById,
  match,
  posts,
  getPostsByUser,
}) => {
  useEffect(() => {
    getProfileById(match.params.user_id)
    getPostsByUser(match.params.user_id)
    // eslint-disable-next-line
  }, [getProfileById, match])

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>

          <Link
            to={`/profile-album/${match.params.user_id}`}
            className='btn btn-dark'
          >
            Photos album
          </Link>

          {auth.isAuthenticated &&
            !auth.loading &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}

          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((exp) => (
                    <ProfileExperience key={exp._id} experience={exp} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
          </div>
          <div className='posts'>
            {posts &&
              posts.length > 0 &&
              posts.map((post) => <PostItem key={post.date} post={post} />)}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  posts: state.post.posts,
})

export default connect(mapStateToProps, { getProfileById, getPostsByUser })(
  Profile
)
