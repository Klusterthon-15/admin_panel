import React from 'react'
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
import { baseUrl } from "../Data";

export default function Dashboard(props) {

  const {items, dispatch} = useItemsContext()
  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  console.log(user.data.token)
  
  useEffect(()=>{
    const fetchItems = async () => {
      const response = await fetch(`${baseUrl}/health_provider/patients/get_patients/`, {
        headers: {
          'Authorization': `Bearer ${user.data.token}`
        }
      })
      const json = await response.json();
      if(response.ok){
        dispatch({type: 'SET_ITEMS', payload: json})
        console.log("workinggggg")
      } else{
        console.log('Bros, this network is not networking')
      }
    }


    if(user){
    showAlert("loading", "Loading...")
    fetchItems()
  }
  
  }, [user, dispatch])
  
  return (
    <div className='home'>
      <style>
            {`.pages{
              min-height: 100vh;
              }
              `}
      </style>
      <Navbar handleClick={props.handleClick}/>

      <div className='main'>
        <h1>Dashboard</h1>
        <section className='dash_section'>
          <div className="dashBanner">
            <div className='dash_text'>
              <h3>Hello, Tope Akinkuade</h3>
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
            <div className="add_patient">
            <p className='stat_big'><IoAddCircle /><br /></p>
              <p className='stat_small'>Add Patient</p>
            </div>
          </div>
          <div className='dash_report'>

          </div>
        </section>
      </div>
      <SelectedPatient />
      {/* {items && <h1>Welcome { user && user.username.charAt(0).toUpperCase() + user.username.slice(1)}, You have {items.length > 0? items.length : "no" } {items.length > 1? "items" : "item"} in your list!</h1>}


        <div className="items_wrapper">
         {items && items.map((item) => (<Item key={item._id} item={item}/>))}

          {(items && items.length == 0)? 
          <div className='empty_list'>
            <img src='/void2.png' alt='no results'/> 
          </div>: ""}
            
          {items && <button onClick={props.handleClick} className='add_item_btn in_wrapper' style={(items.length == 0)? {} : {float: "right", margin:"0"}}>Add a new Item <HiPlus className='plus_icon'/> </button> }
        </div> */}
    </div>
  )
}
