import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'

const Profile = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => {
        getProfiles()
    }, [getProfiles])

    return <Fragment>
        {loading ? <Spinner /> : <Fragment>
            <h1 className='large text-primary'>Photographers</h1>    
            <p className='lead'>
                <i className='fab fa-connectdevelop'></i> Browse and connect with Photographers
            </p>

            <div className='profiles'>
                {profiles.length > 0 ? (
                    profiles.map(profile =>
                        <ProfileItem key={profile.id} profile={profile} />
                    )
                ) : <h4>No profile found</h4>}
            </div>
        </Fragment>}
    </Fragment>
}

Profile.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    profile: state.profile,
})

export default connect(mapStateToProps, { getProfiles })(Profile)
