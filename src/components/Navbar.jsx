import React, { useState } from 'react'
import useLogout from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { IoChevronDownSharp, IoLogOutOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export default function Navbar(props) {
  const {logout} = useLogout()
  const {user} = useAuthContext();
  return (
      <nav className='nav_main'>
        <Link to="/">
          <div className='home_link'>
            <img className="logo" src="/logo.png" alt="" /> 
            <h1>KlustMedics</h1> 
          </div>
        </Link>
        <div className='nav_items'>
          <Link to="/dashboard">Dashboard</Link>
          <hr />
          <Link to="/patients">Patients</Link>
          <hr />
          <Link to="/resources">Resources</Link>
          <hr />
          <Link to="/profile">Profile</Link>
        </div>
        <button className='logout_btn' onClick={logout} >Logout <IoLogOutOutline /> </button>
      </nav>
  )
}

{/* <div className='user_details'>
  <p>{user && user.email}</p>
  <IoChevronDownSharp  className='down_arrow'/>
</div> */}