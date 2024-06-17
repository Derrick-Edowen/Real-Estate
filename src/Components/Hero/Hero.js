import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import man1 from '../../Assets/Images/man1-PhotoRoom.png';
import woman1 from '../../Assets/Images/smiling-blonde-business-woman-posing-with-crossed-arms.png';
import './hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
function Hero() {


  return (

    <div className="heroPage">
         
<div className='filter'></div>
      <img className='mainimg' src={woman1} alt='main' />
      <div className='heroBox'>
        <h1>[Your Messsage Title]</h1>
        <p>[YOUR MESSAGE TO YOUR AUDIENCE<br/>
        
          SELECT ONE OF OUR MANY CLIENT FOCUSED MESSAGES, OR CREATE YOUR OWN]
        </p>
        <div className='sci-hero'>
              <span><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} style={{ color: "#000000" }} size='xs' /></a></span>
              <span><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} style={{ color: "#000000" }} size='xs' /></a></span>
              <span><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} style={{ color: "#000000" }} size='xs' /></a></span>
              <span><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} style={{ color: "#000000" }} size='xs' /></a></span>
              <span><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{ color: "#000000" }} size='xs' /></a></span>
              </div>
      </div>
      </div>
  );
}

export default Hero;

