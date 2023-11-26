import React from 'react'
import { useState, useContext } from "react"
import { IoClose } from "react-icons/io5";
import { useItemsContext } from '../hooks/useItemsContext';
import { AlertContext } from '../context/AlertContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { baseUrl } from '../Data';


export default function NewItemForm(props) {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [healthCondition, setHealthCondition] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    // const {dispatch} = useItemsContext();
    const {showAlert} = useContext(AlertContext);
    const { user } = useAuthContext();
    
    
    const handleSubmit = async (e) =>{
        e.preventDefault()

        if(!user){
            showAlert("error", "You must be logged in!")
            return
        } else{
            showAlert("loading", "Please wait...")
            setIsLoading(true);
        }
        const res = await fetch(`${baseUrl}/health_provider/patients/add_patient`, {
            method: 'POST',
            body: JSON.stringify({
                "full_name":fullname, 
                email, 
                "health_condition":healthCondition, 
                "phone_number":phoneNumber, 
                "date_of_birth":dob, 
                gender
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.data.token}`
            }
        })
        const json = await res.json();
        if(!res.ok){
            showAlert("error", json.status)
            setIsLoading(false);
        }
        if(res.ok){
            setFullname('')
            setEmail('')
            setHealthCondition('')
            setPhoneNumber('')
            setDob('')
            setGender('')
            setIsLoading(false)
            showAlert("", "Patient added successfully✨  activation email sent!")
            props.handleClick()
        }
    }
  return (
    <div className="form_wrapper">

        <div className="form_closeBtn" onClick={props.handleClick}><IoClose/></div>
        
        <form className='item_form' onSubmit={handleSubmit}>
        
        <h2>Enter New Patient details</h2>

        <div>
            <label htmlFor="title">Patients's Name</label>
            <input className="add_item_inputs" type="text" onChange={(e)=>setFullname(e.target.value)} value={fullname} />
        </div>

        <div>
            <label htmlFor="title">Email</label>
            <input className="add_item_inputs" type="text" onChange={(e)=>setEmail(e.target.value)} value={email} />
        </div>
        <div>
            <label htmlFor="title">Diagnosis</label>
            <input className="add_item_inputs" type="text" onChange={(e)=>setHealthCondition(e.target.value)} value={healthCondition} />
        </div>
        <div>
            <label htmlFor="title">Phone Number</label>
            <input className="add_item_inputs" type="text" onChange={(e)=>setPhoneNumber(e.target.value)} value={phoneNumber} />
        </div>
        <div>
            <label htmlFor="title">Date of Birth</label>
            <input className="add_item_inputs" type="date" onChange={(e)=>setDob(e.target.value)} value={dob} />
        </div>
        <div>
            <label htmlFor="title">Gender</label>
            <div className='gender_fieldset'>
                <label htmlFor="">Male</label>
                <input className="add_item_inputs" type="radio" onChange={(e)=>setGender(e.target.value)} value={"male"} name='gender'/>
                
                <label htmlFor="">Female</label>
                <input className="add_item_inputs" type="radio" onChange={(e)=>setGender(e.target.value)} value={"female"} name='gender'/>
            </div>
        </div>

        <button id='form_add_btn' style={isLoading?{cursor:"wait", background:"#8a8a8a"}:{}} >{isLoading? "Loading..." : "Add Patient"}</button>

        </form>
    </div>
  )
}
