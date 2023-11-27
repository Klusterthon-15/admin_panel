import React, { useState, useContext, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { IoRemoveCircleOutline } from "react-icons/io5";
import { AlertContext } from '../context/AlertContext';

const Rsreport = ({patientId}) => {
    console.log(patientId)
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [meds, setMeds] = useState([])
    useEffect(() => {
    const fetchMeds = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/patient/medication/get_medication/${patientId}`, {
              headers: {
                Authorization: `Bearer ${user.data.token}`,
              },
            });
  
            if (response.ok) {
              const json = await response.json();
              console.log(json.data)
              if(json.data){
                setMeds(json.data);
              }
              setIsLoading(false);
              setIsError(false);
            } 
          } catch (error) {
            setIsLoading(false);
            console.log(error)
            setIsError(true);
            showAlert('error', 'An error occurred while fetching patient information');
          }
      };
      if(patientId !== null){
          fetchMeds()
      }
    }, [user, patientId]);

    return ( 
        <section >
            <div className='update_p_header' style={{marginTop:"20px"}}>
                <h2>Rx Report</h2>
                {(meds.length !== 0) && <button type='button'>Print</button>}
            </div>
            {/* {meds && meds.map(med => <div key={med._id}> <p>{med.name}</p></div>)}
            {(meds.length == 0) && <div style={{textAlign:"center"}}><p className='err_logo'><IoRemoveCircleOutline  /></p><p>No Medications Added yet</p></div>} */}
            <div className='dummy'>
                <h2>85%</h2>
                <p>Adherence</p>
            </div>
            <h2>Regimen</h2>
            <p>Insulin 500mg 2x daily</p>
            <p>Aldophthinin 1000mg 1x daily</p>
        </section> 
    );}

export default Rsreport;