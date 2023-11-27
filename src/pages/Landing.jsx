import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6'

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className='landing_wrapper'>
      <style>
        {`.pages{
            padding: 0;
            max-width: none;
            margin-inline: 30px;
          }
          body{
            min-height: 100vh;
            background: url('/landingbg.svg') left bottom / cover no-repeat;
          }
      `}</style>
      <nav className='landing_nav'>
        <a className='home_link'>
          <img className="logo" src="/logo.png" alt="" /> 
          <h1>KlustMedics</h1> 
        </a>
        <div className='landing_links'>
          {/* <div className="nav_login" onClick={()=>navigate('/login')} tabIndex={2}>Login As a Provider</div> */}
          <a target="_blank" href="https://drive.google.com/file/d/1eiEFImn0tz5SjSCL_7UPqJHeILO5JIeK/view" className="nav_signup" onClick={()=>navigate('/')} tabIndex={1}>Download the client app</a>
          <div className="nav_login" onClick={()=>navigate('/signup')} tabIndex={2}>Register as a Provider</div>
          {/* <div className="nav_signup" onClick={()=>navigate('/signup')} tabIndex={1}>Signup</div> */}
        </div>
      </nav>
      <main id='hero'>
        <div id='hero_text'>
          <h2>Your Handy Companion for Medication Adherence Success.</h2>
          {/* <h2>Experience the Power of Tech
          in <span>Collaborative Healthcare!</span></h2> */}
          <p>Klust Medics is a groundbreaking digital solution that revolutionizes medication management for patients with long-term health conditions.</p>
          {/* <p>Our intuitive platform empowers both healthcare professionals and patients to work together seamlessly, fostering improved health outcomes and reduced healthcare costs</p> */}
          <div id='cta_btns'>
            <button className="hero_login" onClick={()=>navigate('/login')}>Login as a Provider</button>
            <a  target="_blank" href="https://drive.google.com/file/d/1eiEFImn0tz5SjSCL_7UPqJHeILO5JIeK/view" className="hero_signup" >Get Started<FaArrowRightLong className='right_icon'/></a>
          </div>
        </div>
        <img className='landing_img' src="/landing_img.jpg" alt="smiling doctor with his laptop" />
      </main>
    </div>
  )
}
