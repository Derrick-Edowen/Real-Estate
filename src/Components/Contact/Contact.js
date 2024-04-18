import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import man from  '../../Assets/Images/man2.png'
import emailjs from '@emailjs/browser';
import './contact.css'
import GoogleMapReact from 'google-map-react';
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
  };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address') || '';
  const price = queryParams.get('price') || '';

    // Add the Google Maps layer to the map
    const cnTowerCoordinates = { lat: 43.6426, lng: -79.3871 };

    return (

      <div className='underLay'>
        {/*
      <section className='venn-diagram'>
        <div className='looki'>
      <img className='conImg' src={man} alt='man'></img>
      <div className='dober'>
      <div className='standIn2'> 
      Lets Start a Conversation!
      </div>
      <p className='arizona'>Looking for expert guidance with your real estate needs? 
      Look no further! Our team is here to assist you every step of the way. Whether 
      you're buying, selling, or looking for investment opportunities, we've got you covered. 
      Contact us today to get started!</p>
      </div>
      </div>
      <div className='standIn'>
        <div className='mines'>
          <div><FontAwesomeIcon icon={faPhone} size='lg'/> 123-456-7890 </div>
      <div><FontAwesomeIcon icon={faEnvelope} size='lg'/> smithrealestate@outlook.com</div>
      <div><FontAwesomeIcon icon={faLocationDot} size='lg'/> 123 Real Estate Drive</div>
      </div>
              <div className='buzi' style={{ height: '200px', width: '100%' }}>
      <GoogleMapReact
        defaultCenter={cnTowerCoordinates}
        defaultZoom={15}
        bootstrapURLKeys={{ key: 'AIzaSyCMPVqY9jf-nxg8fV4_l3w5lNpgf2nmBFM' }} // Do not include API key
      >
        <Marker lat={cnTowerCoordinates.lat} lng={cnTowerCoordinates.lng} />
      </GoogleMapReact>
    </div>
      </div>

      </section>

      <section id="Contact" className="contact--section">
      <form ref={form} onSubmit={sendEmail} className="contact--form--container">
        <div className="container">
          <label htmlFor="name" className="contact--label">
            <span className="text-md">Name:</span>
            <input
              type="text"
              className="contact--input text-md"
              name="name"
              id="name"
              required
            />
          </label>
          <label htmlFor="email" className="contact--label">
            <span className="text-md">Email:</span>
            <input
              type="email"
              className="contact--input text-md"
              name="email"
              id="email"
              required
            />
          </label>
          </div>
          <div className='stress'>
          <label htmlFor="phone-number" className="contact--label">
            <span className="text-md">Phone number:</span>
            <input
              type="number"
              className="contact--input text-md"
              name="phoneNumber"
              id="phone-number"
              required
            />
          </label>
        <label htmlFor="choode-topic" className="contact--label">
          <span className="text-md">Inquiry:</span>
          <select id="choose-topic" className="contact--input text-md" name="topic">
            <option>General Inquiry</option>
            <option>Lease</option>
            <option>Purchase/Sell</option>
          </select>
        </label>

        <label htmlFor="message" className="contact--label">
          <span className="text-md">Message:</span>
          <textarea
            className="contact--input text-md"
            id="message"
            rows="4"
            name="message"
            placeholder="Type your message..."
            required
          />
        </label>
        </div>
        <label htmlFor="checkboc" className="checkbox--label">
          <span className="text-sm">{textVisible && <p>Message successfully sent!</p>}</span>
        </label>
        <div className='confirm'>
          <button className="sendMe btn-primary"> Send Message </button>
          
        </div>
      </form>
    </section>
    */}
   
<section>
<div className='container'>
<div className='contactinfo'>
<div>
  <h2>Contact Info</h2>
  <ul className='info'>
    <li>
      <span><FontAwesomeIcon icon={faLocationDot} style={{color: "#ffffff",}} size='2xl'/></span>
      <span>123 Real Estate Drive <br/>
      Toronto, ON <br/>
      </span>
    </li>
    <li>
      <span><FontAwesomeIcon icon={faEnvelope} style={{color: "#ffffff",}} size='xl'/></span>
      <span>smithrealestate@gmail.com
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
<div className='contactForm'>
  <div className='lostboy'>
  <h2>Lets Start A Conversation!</h2>
  <img src={man}></img>
  </div>
  <div className='formBox'>
    <div className='inputBox w50'>
      <input type='text'name='' required></input>
      <span>First name</span>
    </div>
    <div className='inputBox w50'>
      <input type='text'name='' required></input>
      <span>Last name</span>
    </div>
    <div className='inputBox w50'>
      <input type="email"
              name="email"
              id="email"
              required></input>
      <span>Email Address</span>
    </div>    <div className='inputBox w50'>
      <input type='text'name='' required></input>
      <span>Mobile Number</span>
    </div>
    <div className='inputBox w100'>
      <textarea name='' required></textarea>
      <span>Write your message here...</span>
    </div>
    <div className='inputBox w100'>
      <input type='submit' value="Send" name='' required></input>
    </div>
  </div>
</div>
  </div>
  </section>









</div>










    );
}

export default Contact;