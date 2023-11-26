import React, { useState, useContext, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { ItemsContext } from '../context/ItemContext';
import { baseUrl } from "../Data";

export default function SelectedPatient(props) {
  const { patientId } = useContext(ItemsContext); 
  const {user} = useAuthContext();
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [patient, setPatient] = useState({})

  useEffect(()=>{
    const fetchItems = async () => {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/health_provider/patients/get_patient/${patientId}`, {
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
      setPatient(json.data);
    }

    if(patientId){
    fetchItems()
  }
  
  }, [user, patientId])


  return (
      <div className='nav_main select_patient'>
        <p>{patient.full_name}</p>
        <p>{patient.date_of_birth}</p>
        <p></p>
        <p></p>
      </div>
  )
}

{/* <div className='user_details'>
  <p>{user && user.email}</p>
  <IoChevronDownSharp  className='down_arrow'/>
</div> */}