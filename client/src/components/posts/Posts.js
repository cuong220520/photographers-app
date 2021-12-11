import React, { useEffect, Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { getPosts, searchPosts } from '../../actions/post'
import Spinner from '../layouts/Spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'

const Posts = ({ getPosts, user, post: { posts, loading }, searchPosts }) => {
  const [term, setTerm] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    if (!!term) {
      searchPosts({ term })
    } else {
      getPosts()
    }
  }

  useEffect(() => {
    getPosts()
  }, [getPosts])

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the comunity
      </p>

      <form className='form' onSubmit={(event) => onSubmit(event)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Enter email, post content or username'
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

      <PostForm user={user} />
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post.date} post={post} />
        ))}
      </div>
    </Fragment>
  )
}

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  post: state.post,
})

export default connect(mapStateToProps, { getPosts, searchPosts })(Posts)
