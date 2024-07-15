import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import woman100 from '../../Assets/Images/woman100.jpg';
import './hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faSquareXTwitter, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Hero() {


  return (

    <div className="heroPage">
      <div className='boxerT'>
         <div className='imgBox'>
      <img className='itImg' src={woman100} alt='main' />
      </div>
      <div className='heroBox'>
        <p> - [YOUR MESSAGE TO YOUR AUDIENCE<br/>
          SELECT ONE OF OUR MANY CLIENT FOCUSED MESSAGES, OR CREATE YOUR OWN!]
        </p>
        <div className='sci-hero'>
                <span><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} size="xl" style={{ color: "#94004f" }} /></a></span>
                <span><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} size="xl" style={{ color: "#032e77" }} /></a></span>
                <span><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSquareXTwitter} size="xl" style={{ color: "#2e2e2e" }} /></a></span>
                <span><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{ color: "#000000" }} size='xl' /></a></span>
                <span><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} size="xl" style={{ color: "#072b69" }} /></a></span>
                <span><a href='https://www.youtube.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} size="xl" style={{color: "#d00101",}} /></a></span>
              </div>
      </div>
      </div>
      </div>
  );
}

export default Hero;

