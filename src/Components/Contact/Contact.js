import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import man from  '../../Assets/Images/man2.png'
import emailjs from '@emailjs/browser';
import './contact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';


function Contact() {

    const [textVisible, setTextVisible] = useState(false);
  const handleButtonClick = () => {
    setTextVisible(!textVisible);
  };
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_v6d9ttb', 'template_5gqw9nu', form.current, 'yOaUEgzujolY7QQAj')
      .then(
        () => {
          handleButtonClick()
        }
      )
      setTimeout(() => {
        setTextVisible(false);
        form.current.reset();
      }, 3500);
  };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address') || '';
  const price = queryParams.get('price') || '';

    // Add the Google Maps layer to the map

    return (

      <div className='underLay'>
        
<section>
  
<div className='container'>
<div className='contactinfo'>
<div>
  <h2>Contact Information</h2>
  <ul className='info'>
    <li>
      <span><FontAwesomeIcon icon={faLocationDot} style={{color: "#ffffff",}} size='2xl'/></span>
      <span>123 Real Estate Drive<br/>
      Washington, DC <br/>
      </span>
    </li>
    <li>
      <span><FontAwesomeIcon icon={faEnvelope} style={{color: "#ffffff",}} size='xl'/></span>
      <span>youremail@outlook.com
      </span>
    </li>
    <li>
      <span><FontAwesomeIcon icon={faPhone} style={{color: "#ffffff",}} size='xl'/></span>
      <span>123-456-7890
      </span>
    </li>
  </ul>
  </div>

  <ul className='sci'>
  <li><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} style={{color: "#ffffff"}} size='2xl'/></a></li>
<li><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} style={{color: "#ffffff"}} size='2xl'/></a></li>
<li><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} style={{color: "#ffffff"}} size='2xl'/></a></li>
<li><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} style={{color: "#ffffff"}} size='2xl'/></a></li>
<li><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{color: "#ffffff"}} size='2xl'/></a></li>

  </ul>

</div>
<form ref={form} onSubmit={sendEmail}>

<div className='contactForm'>
  <div className='lostboy'>
  <h2>Lets Start A Conversation!</h2>
  <img className='mrman' alt='Smalll Portrait' src={man}></img>
  </div>
  <div className='formBox'>
    <div className='inputBox w50'>
      <input type="text"
              name="firstName"
              id="firstName"
              required></input>
      <span>First name</span>
    </div>
    <div className='inputBox w50'>
      <input type="text"
              name="lastName"
              id="lastName"
              required></input>
      <span>Last name</span>
    </div>
    <div className='inputBox w50'>
      <input type="email"
              name="email"
              id="email"
              required></input>
      <span>Email Address</span>
    </div>    <div className='inputBox w50'>
      <input type="number"
              name="phoneNumber"
              id="phone-number"
              required></input>
      <span>Mobile Number</span>
    </div>
    <div className='inputBox w100'>
      <textarea id="message"
            name="message"
            required></textarea>
      <span>Write your message here...</span>
    </div>
    <div className='inputBox w100'>
      <input type='submit' value="Send Message" name=''></input>  <br/><br/>
      <span className="text-sm">{textVisible && <p>Message successfully sent!</p>}</span>

    </div>
  </div>
</div>
</form>
  </div>
  </section>







</div>










    );
}

export default Contact;