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
import { baseUrl } from "../Data";

export default function Patients(props) {

  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [patients, setPatients] = useState([]);
  
  useEffect(()=>{
    const fetchItems = async () => {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/health_provider/patients/get_patients/100`, {
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
      setPatients(json.data);
    }


    if(user){
    // showAlert("loading", "Loading...")
    fetchItems()
    console.log(patients)
  }
  
  }, [user])
  
  // const handleSubmit = async (e) =>{
  //   e.preventDefault()

  //   if(!user){
  //       showAlert("error", "You must be logged in!")
  //       return
  //   } else{
  //       showAlert("loading", "Please wait...")
  //       setIsLoading(true);
  //   }
  //   const res = await fetch(`${baseUrl}/health_provider/patients/add_patient`, {
  //       method: 'POST',
  //       body: JSON.stringify({
  //           "full_name":fullname, 
  //           email, 
  //           "health_condition":healthCondition, 
  //           "phone_number":phoneNumber, 
  //           "date_of_birth":dob, 
  //           gender
  //       }),
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${user.data.token}`
  //       }
  //   })
  //   const json = await res.json();
  //   if(!res.ok){
  //       showAlert("error", json.status)
  //       setIsLoading(false);
  //   }
  //   if(res.ok){
  //       props.handleClick()
  //   }
  // }
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
        <h1>Patients</h1>
        <section className='section'>
          <form className="patients_search" onSubmit={{}}>
              <input type="search" placeholder='Search Patients'/>
              <input type="submit" value="Go!" />
          </form>
          <hr />
          {
          isLoading? <div className='dash_loader'><img src='/loader.svg' alt=""/></div> 
          : isError? <div className='dash_err'> 
            <p className="err_logo">
              <MdOutlineErrorOutline/> 
            </p>
        <    p>Oops! Something went wrong. <br />Check your Network and try again!</p></div> 
      :<div className='main'></div>}
              <div className="all_patients_wrapper">
                {patients && patients.map((obj) => <div className='patient_wrapper'><p>{obj.full_name}</p> </div>)}
              </div>
        </section>
      </div>
      <SelectedPatient />
    </div>
  )
}
