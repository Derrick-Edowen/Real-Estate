import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import man from '../../Assets/Images/man2.png';
import woman from '../../Assets/Images/small-woman.png';
import emailjs from '@emailjs/browser';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const [textVisible, setTextVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState([]);

  const form = useRef();

  const handleButtonClick = () => {
    setTextVisible(!textVisible);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_v6d9ttb', 'template_5gqw9nu', form.current, 'yOaUEgzujolY7QQAj')
      .then(
        () => {
          handleButtonClick();
        }
      );
    
    setTimeout(() => {
      setTextVisible(false);
      form.current.reset();
    }, 3500);
  };
  const navigate = useNavigate();

  const handleRouteClick = () => {
    navigate('/Login');
  };
  return (
    <div className='underLay' id='contact'>
      <section >
        <div className='container'>
          <div className='contactinfo'>
            <div>
              <h2>Contact Information</h2>
              <ul className='info'>
                <li>
                  <span><FontAwesomeIcon icon={faLocationDot} style={{ color: "#ffffff" }} size='2xl' /></span>
                  <span>[Office
                    Address /<br /> Business Address]<br />
                  </span>
                </li>
                <li>
                  <span><FontAwesomeIcon icon={faEnvelope} style={{ color: "#ffffff" }} size='xl' /></span>
                  <span>[Your Email Address]</span>

                </li>
                <li>
                  <span><FontAwesomeIcon icon={faPhone} style={{ color: "#ffffff" }} size='xl' /></span>
                  <span>[Your Phone Number]
                  </span>
                </li>
              </ul>
            </div>

            <ul className='sci'>
              <li><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} style={{ color: "#ffffff" }} size='2xl' /></a></li>
              <li><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} style={{ color: "#ffffff" }} size='2xl' /></a></li>
              <li><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} style={{ color: "#ffffff" }} size='2xl' /></a></li>
              <li><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faXTwitter} style={{ color: "#ffffff" }} size='2xl' /></a></li>
              <li><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{ color: "#ffffff" }} size='2xl' /></a></li>
            </ul>
          </div>

          <form ref={form} onSubmit={sendEmail}>
            <div className='contactForm'>
              <div className='lostboy'>
                <h2>Lets Start A Conversation!</h2>
              </div>
              <div className='formBox'>
                <div className='inputBox w50'>
                  <input type="text" name="firstName" id="firstName" required></input>
                  <span>First name</span>
                </div>
                <div className='inputBox w50'>
                  <input type="text" name="lastName" id="lastName" required></input>
                  <span>Last name</span>
                </div>
                <div className='inputBox w50'>
                  <input type="email" name="email" id="email" required></input>
                  <span>Email Address</span>
                </div>
                <div className='inputBox w50'>
                  <input type="number" name="phoneNumber" id="phone-number" required></input>
                  <span>Mobile Number</span>
                </div>
                <div className='inputBox w100'>
                  <textarea id="message" name="message" required></textarea>
                  <span>Write your message here...</span>
                </div>
                <div className='inputBox w100'>
                  <input type='submit' value="Send Message" name=''></input> <br /><br />
                  <span className="text-sm">{textVisible && <p>Message successfully sent!</p>}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <span>&copy;One Estate Web Services</span>
      <span>Terms of Service</span>
      <span>Privacy Policy</span>
      <button onClick={handleRouteClick}>Agent Access</button>

    </div>
  );
}

export default Contact;
