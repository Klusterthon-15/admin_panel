import React, { useState } from 'react'
import { useEffect, useContext } from "react"
import { useItemsContext } from '../hooks/useItemsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Item from "../components/Item";
import Navbar from '../components/Navbar'
import { HiPlus } from "react-icons/hi";
import Alert from '../components/Alert';
import { AlertContext } from '../context/AlertContext';
import SelectedPatient from '../components/SelectedPatient';
import { IoPersonCircle, IoAddCircle  } from "react-icons/io5";
import { MdOutlineErrorOutline } from "react-icons/md";
import { baseUrl } from "../Data";

export default function Dashboard(props) {

  // const {items, dispatch} = useItemsContext()
  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [ provider, setProvider ] = useState({})

  
  useEffect(()=>{
    const fetchItems = async () => {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/health_provider/profile/get_provider`, {
        headers: {
          'Authorization': `Bearer ${user.data.token}`
        }
      })
      
      if(response.ok){
        setIsLoading(false)
        setIsError(false)
      } else{
        setIsLoading(false)
        setIsError(true)
        showAlert("error", "Network Error!")
      }

      const json = await response.json();
      setProvider(json.data)
    }



    if(user){
    // showAlert("loading", "Loading...")
    fetchItems()
  }
  
  }, [user])

  
  return (
    <div className='home'>
      <style>
            {`.pages{
              min-height: 100vh;
              }
              `}
      </style>
      <Navbar handleClick={props.handleClick}/>

      {isLoading? <div className='dash_loader'><img src='/loader.svg' alt=""/></div> 
      : isError? <div className='dash_err'> 
        <p className="err_logo">
          <MdOutlineErrorOutline/> 
        </p>
        <p>Oops! Something went wrong. <br />Check your Network and try again!</p>
      </div> 
      :<div className='main'>
        <h1>Dashboard</h1>
        <section className='dash_section'>
          <div className="dashBanner">
            <div className='dash_text'>
              <h3>Hi, {provider? provider.full_name : "Health Provider"}</h3>
              <p>How was your day?</p>
            </div>
            <img src="/banner_img.svg" alt="" />
          </div>
          <div className="dash_stats">
            <div>
              <p className='stat_big'><IoPersonCircle />202</p>
              <p className='stat_small'>Total Patients</p>
            </div>
            <div>
            <p className='stat_big'><IoPersonCircle />12</p>
              <p className='stat_small'>Assigned Patients</p>
            </div>
            <div className="add_patient" onClick={props.handleClick} >
            <p className='stat_big'><IoAddCircle /><br /></p>
              <p className='stat_small'>Add Patient</p>
            </div>
          </div>
        </section>
      </div>}
      <SelectedPatient/>
    </div>
  )
}
