import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserById } from '../../actions/user'
import Spinner from '../layouts/Spinner'
import { Link } from 'react-router-dom'

export const ProfileAlbum = ({
  match,
  getUserById,
  user: { user, loading },
}) => {
  useEffect(() => {
    getUserById(match.params.userId)
    // eslint-disable-next-line
  }, [])

  return !user || loading ? (
    <Spinner />
  ) : (
    <>
      <Link to='/profiles' className='btn btn-light'>
        Back To Profiles
      </Link>
      <h1 style={{ marginTop: '2rem' }}>Photos album</h1>
      <div>
        {user.photos && user.photos.length > 0 ? (
          <div className='uploaded-images-container'>
            {user.photos.map((photo, key) => (
              <img src={`${photo}`} alt='album-images' key={key} />
            ))}
          </div>
        ) : (
          <h1>This user has no images</h1>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  getUserById,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAlbum)
