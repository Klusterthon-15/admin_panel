import React, { useState } from 'react'
import useLogout from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { IoChevronDownSharp, IoLogOutOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export default function SelectedPatient(props) {
  const {user} = useAuthContext();
  return (
      <div className='nav_main select_patient'>
        
      </div>
  )
}

{/* <div className='user_details'>
  <p>{user && user.email}</p>
  <IoChevronDownSharp  className='down_arrow'/>
</div> */}