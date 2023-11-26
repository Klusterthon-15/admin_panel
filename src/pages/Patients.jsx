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
import { ItemsContext } from '../context/ItemContext';

export default function Patients(props) {

  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [patients, setPatients] = useState([]);
  const [cachedPatients, setCachedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { dispatch } = useContext(ItemsContext);
  
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
      setCachedPatients(json.data)
    }


    if(user){
    fetchItems()
  }
  
  }, [user])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredPatients = cachedPatients.filter((patient) => {
      return patient.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setPatients(filteredPatients);
  };


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
          <form className="patients_search" onSubmit={handleSubmit}>
            <input type="search" placeholder='Search Patient Names' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <input type="submit" value="Go!" />
            <button className='clear_search'>Clear</button>
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
              {patients && patients.map((obj) => (
                <div onClick={() => dispatch({ type: 'SET_SELECTED_PATIENT', payload:obj._id })} className='patient_wrapper' key={obj._id}>
                  <p>{obj.full_name}</p>
                </div>
              ))}
              </div>
        </section>
      </div>
      <SelectedPatient />
    </div>
  )
}
