import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NavBar from './components/layouts/NavBar'
import Landing from './components/layouts/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layouts/Alert'
import UnauthorizationPage from './components/layouts/UnauthorizationPage'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'
import CreateProfile from './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'
import AddExperience from './components/profile-form/AddExperience'
import AddEducation from './components/profile-form/AddEducation'
import Profiles from './components/profiles/Profile'
import Profile from './components/profile/Profile'
import ProfileAlbum from './components/profile/ProfileAlbum'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import Admin from './components/admin/Admin'

import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

import './App.css'

// redux
import { Provider } from 'react-redux'
import store from './store'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />

          <Route exact path='/' component={Landing} />

          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute
                exact
                path='/profiles'
                component={Profiles}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/profile/:user_id'
                component={Profile}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/403error'
                component={UnauthorizationPage}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/admin'
                component={Admin}
                expectedAuthorities={['admin']}
              />
              <PrivateRoute
                exact
                path='/dashboard'
                component={Dashboard}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/posts'
                component={Posts}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/posts/:id'
                component={Post}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
              <PrivateRoute
                exact
                path='/profile-album/:userId'
                component={ProfileAlbum}
                expectedAuthorities={['user', 'photographer', 'admin']}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
