import React, { useState } from 'react'
import { useEffect, useContext } from "react"
import { useAuthContext } from '../hooks/useAuthContext';
import Navbar from '../components/Navbar'
import { AlertContext } from '../context/AlertContext';
import SelectedPatient from '../components/SelectedPatient';
import { baseUrl } from "../Data";
import { ItemsContext } from '../context/ItemContext';
import { MdOutlineErrorOutline } from 'react-icons/md';

export default function Patients(props) {

  const { user } = useAuthContext();
  const {showAlert} = useContext(AlertContext);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [patients, setPatients] = useState([]);
  const [cachedPatients, setCachedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { dispatch } = useContext(ItemsContext);

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
  useEffect(()=>{

    if(user){
      try{
        fetchItems()
      }catch(e){
        setIsLoading(false)
        setIsError(true)
        showAlert("error", "Network Error!")
      }
  } else{
    showAlert("error", "Please Login!")
  }
  
  }, [user])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredPatients = cachedPatients.filter((patient) => {
      return patient.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setPatients(filteredPatients);
  };

  const loadingBlock = <div className='dash_loader'><img src='/loader.svg' alt=""/></div>
  const errorBlock = <div className='dash_err'> <p className="err_logo"> <MdOutlineErrorOutline/> </p> <p>Oops! Something went wrong. <br />Check your Network and try again!</p></div>

  const clearForm = () =>{
    setSearchTerm("");
    handleSubmit;
  }

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
            <button className='clear_search' onClick={clearForm}>Clear</button>
          </form>
          <hr />
          { isLoading? loadingBlock : isError? errorBlock :
              <div className="all_patients_wrapper">
                  {patients && patients.map((obj) => (
                  <div onClick={() => dispatch({ type: 'SET_SELECTED_PATIENT', payload: obj._id })} className='patient_wrapper' key={obj._id}>
                    <p>{obj.full_name}</p>
                    <p className="patient_verify_badge" style={!obj.verified? {background: "rgb(242, 70, 7)"} : {background: "rgb(14, 205, 7)",}}>{obj.verified? "Verified" : "Not Verified"}</p>
                  </div>
                ))}
              </div>}
        </section>
      </div>
      <SelectedPatient handleUpdate={()=> fetchItems()}/>
    </div>
  )
}
