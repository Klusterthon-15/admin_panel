import React, { useState, useContext, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { ItemsContext } from '../context/ItemContext';
import { AlertContext } from '../context/AlertContext';
import { baseUrl } from '../Data';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { IoRemoveCircleOutline } from "react-icons/io5";
import { FaRegSmileWink } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Rxreport from "./Rxreport"

export default function SelectedPatient({handleUpdate}) {
  const { patientId } = useContext(ItemsContext);
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [patient, setPatient] = useState({});
  const { showAlert } = useContext(AlertContext);

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isdefault, setisDefault] = useState(true);

  const getId = () =>{
    const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient'));
    return patientId? patientId : selectedPatient ? selectedPatient.data._id : null;
  }

  useEffect(() => {
    const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient'));

    const fetchItems = async () => {
      try {
          setIsLoading(true);
          const response = await fetch(`${baseUrl}/health_provider/patients/get_patient/${patientId}`, {
            headers: {
              Authorization: `Bearer ${user.data.token}`,
            },
          });

          if (response.ok) {
            const json = await response.json();
            localStorage.setItem('selectedPatient', JSON.stringify(json));
            setPatient(json.data);
            setIsLoading(false);
            setIsError(false);
            setFullname(json.data.full_name || '');
            setEmail(json.data.email || '');
            setHealthCondition(json.data.health_condition || '');
            setPhoneNumber(json.data.phone_number || '');
            setDob(json.data.date_of_birth || '');
            setGender(json.data.gender || '');
          } 
        } catch (error) {
          setIsLoading(false);
          console.log(error)
          setIsError(true);
          showAlert('error', 'An error occurred while fetching patient information');
        }
    };

    if(!patientId && !selectedPatient){
        setisDefault(true)
    }else{
      setisDefault(false)
    }

    if (patientId && selectedPatient?.data._id !== patientId) {
      fetchItems();
      setReadOnly(true)
    } else if(selectedPatient){
      setPatient((selectedPatient.data) || {})
      setFullname((selectedPatient.data.full_name) || '');
      setEmail((selectedPatient.data.email) || '');
      setHealthCondition((selectedPatient.data.health_condition) || '');
      setPhoneNumber((selectedPatient.data.phone_number) || '');
      setDob((selectedPatient.data.date_of_birth) || '');
      setGender((selectedPatient.data.gender) || '');
    }

  }, [user, patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      showAlert('error', 'You must be logged in!');
      return;
    } else {
      showAlert('loading', 'Please wait...');
      setIsLoading2(true);
    }
    
  
    try {
      const formData = new FormData();
      formData.append('full_name', fullname);
      formData.append('email', email);
      formData.append('date_of_birth', dob);
      formData.append('gender', gender);
      formData.append('health_condition', healthCondition);
      formData.append('phone_number', phoneNumber);
  
      const res = await fetch(`${baseUrl}/health_provider/patients/edit_patient/${patientId || patient._id}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
  
      const json = await res.json();
      if (!res.ok) {
        showAlert('error', json.status);
        setIsLoading2(false);
      }
      if (res.ok) {
        setIsLoading2(false);
        setReadOnly(true);
        showAlert('', 'Patient updated successfully!');
        const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient'));
        if(handleUpdate){handleUpdate()};
        localStorage.setItem('selectedPatient', JSON.stringify({
          ...selectedPatient,
          full_name: fullname,
          email,
          date_of_birth: dob,
          gender,
          health_condition: healthCondition,
          phone_number: phoneNumber,
        }));
      }
    } catch (error) {
      setIsLoading2(false);
      console.log(error);
      showAlert('error', 'An error occurred while updating patient information');
    }
  };
  function cancelUpdate(){
    setReadOnly(true)
    const selectedPatient = JSON.parse(localStorage.getItem('selectedPatient'));
    setPatient(selectedPatient.data)
    setFullname((selectedPatient.data.full_name) || '');
    setEmail((selectedPatient.data.email) || '');
    setHealthCondition((selectedPatient.data.health_condition) || '');
    setPhoneNumber((selectedPatient.data.phone_number) || '');
    setDob((selectedPatient.data.date_of_birth) || '');
    setGender((selectedPatient.data.gender) || '');
  }
  
  return (
    <div className='nav_main select_patient'>
      {isLoading ? (
        <div className='dash_loader'>
          <img src='/loader.svg' alt='' />
        </div>
      ) : isError ? (
        <div className='dash_err'>
          <p className='err_logo'>
            <MdOutlineErrorOutline />
          </p>
          <p>
            Oops! Something went wrong. <br /> Check your Network and try again!
          </p>
        </div>
      ) : isdefault ? (
        <div style={{textAlign:"center"}}>
          <p className='err_logo'>
            <FaRegSmileWink/>
            
          </p>
          <p>This panel allows you to manage patient information from anywhere in the application.<br /> <br />Click <Link to={'/patients'}>Here</Link> and select a patient name to get started</p>
        </div>
      ) : (<div className='select_patient_body'>
        <form className='select_patient_form' onSubmit={handleSubmit}>
          <div className='update_p_header'>
          <h2>Patient details</h2>
          </div>
          {/* <hr /> */}
          <div className="update_p_inputs">
            <label htmlFor='title'>Name</label>
            <input
              className='update_patient'
              type='text'
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              readOnly={readOnly} 
              style={readOnly? {border:"none", textAlign:"right", fontSize:"1em", padding: "0", background: "transparent"} : {}}
            />
          </div>

          <div className="update_p_inputs">
            <label htmlFor='title'>Email</label>
            <input
              className='update_patient'
              style={readOnly? {border:"none", textAlign:"right", fontSize:"1em", padding: "0", background: "transparent"} : {}}
              type='text'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              readOnly={readOnly}
            />
          </div>
          <div className="update_p_inputs">
            <label htmlFor='title'>Diagnosis</label>
            <input
              className='update_patient'
              style={readOnly? {border:"none", textAlign:"right", fontSize:"1em", padding: "0", background: "transparent"} : {}}
              type='text'
              onChange={(e) => setHealthCondition(e.target.value)}
              value={healthCondition}
              readOnly={readOnly}
            />
          </div>
          <div className="update_p_inputs">
            <label htmlFor='title'>Phone Number</label>
            <input
              className='update_patient'
              style={readOnly? {border:"none", textAlign:"right", fontSize:"1em", padding: "0", background: "transparent"} : {}}
              type='text'
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
              readOnly={readOnly}
            />
          </div>
          <div className="update_p_inputs">
            <label htmlFor='title'>Date of Birth</label>
            <input
              className='update_patient'
              style={readOnly? {border:"none", textAlign:"right", fontSize:"1em", padding: "0", background: "transparent", marginRight: "-20px"} : {}}
              type='date'
              onChange={(e) => setDob(e.target.value)}
              value={dob}
              readOnly={readOnly}
            />
          </div>
          <div className="update_p_inputs">
            <label htmlFor='title'>Gender</label>
            {readOnly && (gender == "female"? "Female" : "Male") }
              {!readOnly && 
            <div className=''>
              <label htmlFor=''>Male</label>
              <input
                className=''
                type='radio'
                onChange={(e) => setGender(e.target.value)}
                value={'male'}
                checked={gender == "male"}
                name='gender'
                readOnly={readOnly}
                style={{marginRight:"25px"}}
              />

              <label htmlFor=''>Female</label>
              <input
                className=''
                type='radio'
                onChange={(e) => setGender(e.target.value)}
                value={'female'}
                checked={gender == "female"}
                name='gender'
                readOnly={readOnly}
              />
            </div>}
          </div>
          <div className="update_p_header bottom_u_p">
            { readOnly && <button type='button' onClick={() => setReadOnly(false)}  title='Update Patient Details'>Update
            </button>}
          { !readOnly && <button type='button' onClick={() => cancelUpdate()} className='cancel_update' >Cancel</button>}
          {!readOnly && <button
            onClick={handleSubmit}
            style={isLoading2 ? { cursor: 'wait', background: '#8a8a8a' } : {}}
            className='save_update_btn'
          >
            {isLoading2 ? 'Loading...' : 'Save'}
          </button>}
            
          </div>
        </form>
          <hr style={{marginTop:"20px"}}/>
          <Rxreport patientId={getId()}/>
        </div>
      )}
    </div>
  );
}
