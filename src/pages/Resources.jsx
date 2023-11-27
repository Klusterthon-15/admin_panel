import React from 'react'
import { useEffect, useContext, useState } from "react"
import { useItemsContext } from '../hooks/useItemsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Item from "../components/Item";
import Navbar from '../components/Navbar'
import { HiPlus } from "react-icons/hi";
import Alert from '../components/Alert';
import { AlertContext } from '../context/AlertContext';
import SelectedPatient from '../components/SelectedPatient';
import { baseUrl } from "../Data";

export default function Resources(props) {

  const {items, dispatch} = useItemsContext()
  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  const [resources, setResources] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(false); 
  
  useEffect(()=>{
    const fetchItems = async () => {
      // showAlert("loading", "Loading...")
      setIsLoading(true)
      const response = await fetch('https://klustmedics-api.vercel.app/health_provider/resources/get_resources/100', {
        headers: {
          'Authorization': `Bearer ${user.data.token}`
        }
      })
      const json = await response.json();
      
      if(response.ok){
        setIsLoading(false)
        setIsError(false)
        setResources(json.data)
      } else{
        setIsLoading(false)
        setIsError(true)
        showAlert("error", "Network Error")
      }
    }

    if(user){
    fetchItems()
  }
  
  }, [user, dispatch])
  
  console.log(resources)
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
        <h1>Resources</h1>
        <section className='section' style={{display:"flex", justifyContent:"center"}}>
          {isLoading ? (
            <div className='dash_loader' style={{height:"400px"}}>
              <img src='/loader.svg' alt=""/>
            </div>
          ) : isError ? (
            <div className='dash_err'> 
              <p className="err_logo">
                <MdOutlineErrorOutline/> 
              </p>
              <p>Oops! Something went wrong. <br />Check your Network and try again!</p>
            </div>
          ) : (
            <div className="resources_wrapper">
              {resources && resources.map(item => (
                <div key={item._id} className="resource_body">
                  <img src={item.img.url} alt="" />
                  <p>{item.title}</p>
                  <p>{item.description}</p>
                  <div>
                    <p>By {item.provider_id.full_name} </p>
                    {item.created_at && <p>{new Date(item.created_at).toLocaleString().slice(0, 10)}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <SelectedPatient />

    </div>
  )
}
