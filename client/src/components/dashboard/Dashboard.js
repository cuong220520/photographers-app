import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import Spinner from '../layouts/Spinner'
import DashboardActions from './DashboardActions'
import { getCurrentProfile } from '../../actions/profile'

const Dashboard = ({
    getCurrentProfile,
    profile: { profile, loading },
    auth: { user },
}) => {
    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> {'  '}
                Welcome {user && user.name}
            </p>

            {profile !== null ? (
                <Fragment>
                    <DashboardActions />
                </Fragment>
            ) : (
                <Fragment>
                    <p>You have not yet set up a profile, please add some info</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
                </Fragment>
            )}
        </Fragment>
    )
}

Dashboard.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
