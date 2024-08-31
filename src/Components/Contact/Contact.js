import React, { useState, useRef } from 'react';
import axios from 'axios';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faYoutube,faSquareXTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faAt, faPhoneVolume, faUser, faPencil, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import woman100 from '../../Assets/Images/woman100.jpg';
import silo from '../../Assets/Images/YourPhotoHEre.jpg'

function Contact() {
  const [textVisible, setTextVisible] = useState(false);

  const form = useRef();

  const handleButtonClick = () => {
    setTextVisible(!textVisible);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const formData = {
      firstName: e.target.firstName.value,
      email: e.target.email.value,
      phoneNumber: e.target.phoneNumber.value,
      message: e.target.message.value,
    };

    try {
      await axios.post('/api/send-email', formData);
      setTimeout(() => {
        setTextVisible(true);
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
    }
    setTimeout(() => {
      setTextVisible(false);
      form.current.reset();
    }, 4500);
  };
  
  const navigate = useNavigate();

  const handleRouteClick = () => {
    navigate('/Login');
  };
  return (
    <div className='newsetunderLay' id='contact'>
      <section >
        <div className='fitcontainer'>


        <div className='megainfo'>
        <img className='mainimg199' src={silo} alt='main' />      
          <div className='descTextJv'>[ Brokerage / Business Icon ]</div>
          <div className='descTextJv'>[ Brokerage / Business Name ]</div>
          <div className='descTextJv'>[ Brokerage /  Business Address ]</div>
          <div className='descTextJv'>[ Brokerage /  Business Number ]</div>
          </div>


          <div className='contactinfo'>
          <div className='descTextJv'>[ Your Name ]</div>
          <div className='descTextJv'>[ Sales Representative / Broker ]</div>
          <div className='descTextJv'>[ Your Email ]</div>
          <div className='descTextJv'>[ Your Phone Number ]</div>
          <div className='descTextJv'> Lets Connect! </div>
          <div className='sci-hero2'>
                <span><a href='https://www.instagram.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} size="xl" style={{ color: "#94004f" }} /></a></span>
                <span><a href='https://www.facebook.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} size="xl" style={{ color: "#032e77" }} /></a></span>
                <span><a href='https://twitter.com/?lang=en' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSquareXTwitter} size="xl" style={{ color: "#2e2e2e" }} /></a></span>
                <span><a href='https://www.tiktok.com/en/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTiktok} style={{ color: "#000000" }} size='xl' /></a></span>
                <span><a href='https://www.linkedin.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} size="xl" style={{ color: "#072b69" }} /></a></span>
                <span><a href='https://www.youtube.com/' target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} size="xl" style={{color: "#d00101",}} /></a></span>
              </div>
          </div>




            <div className='contactForm-specific'>
            <div className='descTexcjb'> Contact Form</div>

            <form ref={form} onSubmit={sendEmail}>
      <div className='lostboy-specific'></div>
      <div className='formBox-specific'>
        <div className='inputBox-specific'>
          <input type="text" name="firstName" id="firstName" required />
          <label htmlFor="firstName">Name</label>
          <FontAwesomeIcon icon={faUser} className="icon-specific"/>
        </div>
        <div className='inputRow-specific'>
          <div className='inputBox-specific'>
            <div className="inputWrapper-specific">
              <input type="email" name="email" id="email" required />
              <label htmlFor="email">Email Address</label>
              <FontAwesomeIcon icon={faAt} className="icon-specific" />
            </div>
          </div>
          <div className='inputBox-specific'>
            <input type="tel" name="phoneNumber" id="phone-number" pattern="[0-9]*" required />
            <label htmlFor="phone-number">Phone Number</label>
            <FontAwesomeIcon icon={faPhoneVolume} className="icon-specific"/>
          </div>
        </div>
        <div className='inputBox-specific'>
          <textarea id="message" name="message" required></textarea>
          <label htmlFor="message">Write your message here...</label>
          <FontAwesomeIcon icon={faPencil} className="icon-specific"/>
        </div>
        <div className='inputBox-specific'>
          <input type='submit' value="Send Message" name='' />
          <FontAwesomeIcon icon={faPaperPlane} style={{color: "#ffffff",}} className="icon-specific1"/>
          <br />
          <span className="text-sm-specific">{textVisible && <p>Message successfully sent!</p>}</span>
        </div>
      </div>
    </form>

</div>


        </div>

      </section>
      <div className='lostboy1'>
      <div className='descTextJd'>[ All property listings on this website are provided by third-party real estate agents, brokers, and service providers. We do not guarantee the accuracy, completeness, or reliability of these listings. It is the responsibility of the potential buyer or renter to verify all property details and conduct their due diligence before making any financial decisions. ]</div>
    </div>
      <div className='lostboy'>
      <span>
        <a href="/Our Mission" target="_blank" rel="noopener noreferrer">
          &copy;One Estate Web Services
        </a>
      </span>
      <span>
        <a href="/Terms of Service" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
      </span>
      <span>
        <a href="/Privacy Policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </span>
      <span>
        <a href="/Pricing & Subscriptions" target="_blank" rel="noopener noreferrer">
          [ Pricing & Subscriptions ]
        </a>
      </span>
<button className="agentPortalButton" onClick={handleRouteClick}>Agent Portal</button>
    </div>

    </div>
  );
}

export default Contact;
