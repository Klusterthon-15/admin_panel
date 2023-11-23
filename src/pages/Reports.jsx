import React from 'react'
import { useEffect, useContext } from "react"
import { useItemsContext } from '../hooks/useItemsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Item from "../components/Item";
import Navbar from '../components/Navbar'
import { HiPlus } from "react-icons/hi";
import Alert from '../components/Alert';
import SelectedPatient from '../components/SelectedPatient';
import { AlertContext } from '../context/AlertContext';

export default function Reports(props) {

  const {items, dispatch} = useItemsContext()
  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  
  useEffect(()=>{
    const fetchItems = async () => {
      const response = await fetch('https://fantastick-api.vercel.app/api/items/', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json();
      
      if(response.ok){
        dispatch({type: 'SET_ITEMS', payload: json})
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
        <h1>Reports</h1>
        <section className='section'>

        </section>
      </div>
      <SelectedPatient />

    </div>
  )
}
