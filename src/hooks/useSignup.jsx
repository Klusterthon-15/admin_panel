import { useState, useContext } from "react";
import {useAuthContext} from './useAuthContext'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../context/AlertContext';

export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()
    const {showAlert} = useContext(AlertContext);
    const baseUrl = "https://klustmedics-api.vercel.app";

    const signup = async (username, email, password, phone) => {
        setIsLoading(true)
        setError(null)
        const full_name = username;
        const phone_number = phone;

        console.log(baseUrl)
        const response = await fetch(`${baseUrl}/health_provider/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({full_name, email, password, phone_number})
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            showAlert("error", json.status)
        }
        if(response.ok) {
            // localStorage.setItem('user', JSON.stringify(json))
            // dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
            navigate("/login")
        }
    }

    return {signup, isLoading, error}
}