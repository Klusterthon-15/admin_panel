import React, { useState, useEffect, useContext } from 'react';
import { useItemsContext } from '../hooks/useItemsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Navbar from '../components/Navbar';
import SelectedPatient from '../components/SelectedPatient';
import { AlertContext } from '../context/AlertContext';
import { baseUrl } from '../Data';

export default function Profile(props) {
  const { dispatch } = useItemsContext();
  const { user } = useAuthContext();
  const { showAlert } = useContext(AlertContext);
  const [provider, setProvider] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // State to track form inputs
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    status: '',
  });

  // State to manage form editability
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/health_provider/profile/get_provider`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      if (response.ok) {
        setIsLoading(false);
        setIsError(false);
      } else {
        setIsLoading(false);
        setIsError(true);
        showAlert('error', 'Network Error!');
      }

      const json = await response.json();
      setProvider(json.data);

      // Populate the form data with fetched provider information
      setFormData({
        email: json.data.email || '',
        full_name: json.data.full_name || '',
        phone_number: json.data.phone_number || '',
        status: json.data.status || '',
      });
    };

    if (user) {
      fetchItems();
    }
  }, [user, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showAlert('error', 'You must be logged in!');
      return;
    } else {
      showAlert('loading', 'Please wait...');
      setIsLoading(true);
    }

    try {
      const res = await fetch(`${baseUrl}/health_provider/profile/update_profile`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        showAlert('error', json.status);
        setIsLoading(false);
      }
      if (res.ok) {
        setIsLoading(false);
        showAlert('', 'Profile updated successfully!');
      }
    } catch (error) {
      setIsLoading(false);
      showAlert('error', 'An error occurred while updating profile information');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cancelUpdate = () =>{
    setIsEditable(false)
    setFormData(provider)
  }

  return (
    <div className='home pages'>
      <Navbar handleClick={props.handleClick} />
      <div className='main'>
        <h1>Profile</h1>
        <section className='section'>
          {isLoading ? (
              <div className='dash_loader' style={{height:"400px"}}>
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
            ) : (
                <div>
                  <form onSubmit={handleSubmit} className={isEditable? "provider_form" : "provider_form provider_frm_noedit"}>
                    <h2>Personal Information</h2>
                    <div>
                      <label>Full Name:</label>
                      <input className='add_item_inputs'
                        type='text'
                        name='full_name'
                        value={formData.full_name}
                        onChange={handleChange}
                        readOnly={!isEditable}
                      />
                    </div>
                    <div>
                      <label>Email:</label>
                      <input className='add_item_inputs'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={!isEditable}
                      />
                    </div>
                    <div>
                      <label>Phone Number:</label>
                      <input className='add_item_inputs'
                        type='text'
                        name='phone_number'
                        value={formData.phone_number}
                        onChange={handleChange}
                        readOnly={!isEditable}
                      />
                    </div>
                    <div>
                      <label>Status:</label>
                      < input className='add_item_inputs'
                        type='text'
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        readOnly={!isEditable}
                      />       
                    </div>
                  </form>
                    <div className='update_p_header bottom_profile'>
                    {isEditable ? (
                      <button onClick={handleSubmit}>Save</button>
                    ) : (
                      <button onClick={() => setIsEditable(true)}>
                        Update
                      </button>
                    )}
                    {isEditable && <button className='cancel_update' onClick={()=>cancelUpdate()}>Cancel</button>}
                    </div>
                  </div>
            )}
        </section>
      </div>
      <SelectedPatient />
    </div>
  );
}
