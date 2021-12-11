import React from 'react'
import { Link } from 'react-router-dom'

function UnauthorizationPage() {
  return (
    <div className='container'>
      <h2 variant='h4'>Oops! You do not have permission to access this page</h2>
      <Link className='btn btn-light' style={{ marginTop: 15 }} variant='contained' to='/'>
        Back Home
      </Link>
    </div>
  )
}
export default UnauthorizationPage
