import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import Spinner from '../layouts/Spinner'

import { connect } from 'react-redux'

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, user },
  expectedAuthorities,
  ...rest
}) =>
  loading ? (
    <Spinner />
  ) : (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect to='/login' />
        ) : user &&
          user.role &&
          expectedAuthorities.filter((exptAuth) =>
            [user.role].includes(exptAuth)
          ).length === 0 ? (
          <Redirect to='/403error' />
        ) : (
          user && user.role && <Component {...props} />
        )
      }
    />
  )

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)
