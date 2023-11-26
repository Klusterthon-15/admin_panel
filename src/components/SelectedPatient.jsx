import React, { useState, useContext, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { ItemsContext } from '../context/ItemContext';
import { baseUrl } from "../Data";
import { MdOutlineErrorOutline } from 'react-icons/md';

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

  const loadingBlock = <div className='dash_loader'><img src='/loader.svg' alt=""/></div>
  const errorBlock = <div className='dash_err'> <p className="err_logo"> <MdOutlineErrorOutline/> </p> <p>Oops! Something went wrong. <br />Check your Network and try again!</p></div>

  return (
      <div className='nav_main select_patient'>
        {isLoading? loadingBlock : isError? errorBlock: 
        <div className="select_p_wrap">
          <p>{patient.full_name}</p>
          <p>{patient.date_of_birth}</p>
          <p>{patient.email}</p>
          <p>{patient.phone_number}</p>
          <p>{patient.phone_number}</p>
        </div>
      }
      </div>
  )
}

{/* <div className='user_details'>
  <p>{user && user.email}</p>
  <IoChevronDownSharp  className='down_arrow'/>
</div> */}