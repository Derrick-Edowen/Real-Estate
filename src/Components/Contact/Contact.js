import React, { useState, useEffect, useRef } from 'react';
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import man from  '../../Assets/Images/man2.png'
import emailjs from '@emailjs/browser';
import './Index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

//import Footer from '../Footer/Footer';



function Contact() {
    const [images] = useState([image1, image2, image3, image4, image5]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 18000);
  
      return () => clearInterval(interval);
    }, [images]);
  
    const imageStyle = {
      backgroundImage: `url(${images[currentIndex]})`,
    };
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

    return (<>
        <div className='contactPage'>
<div className="contact" style={imageStyle}>
        <div className='underLay'>
          <div className='venn-diagram'>
      <img className='conImg circle left' src={man} alt='man'></img>
      <div className='standIn circle right'></div>
      <div className='standOut circle right'>
        <p>
        Phone Number: 123-456-7890<br />
        Email: JohnSmith@outlook.com<br />
        Office Phone: 098-765-4321<br />
        Office Address: 123 Real Estate Ave<br /><br />
        or<br /><br />
        Send me a Message!
        </p>

      </div>
      <div className='littleOut circle right'></div>
      <div className='miniArr'>
      <FontAwesomeIcon icon={faArrowRight} beat size="2xl" style={{color: "#d4c8df",}} />      
      </div>
      </div>

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
        <label htmlFor="price-range" className="contact--label">
            <span className="text-md">Price Range:</span>
            <input
              type="text"
              className="contact--input text-md"
              name="priceRange"
              id="price-Range"
              placeholder='Ex: Purchase for $1,500,000 / Lease for $2500'
            />
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
        <label htmlFor="checkboc" className="checkbox--label">
          <span className="text-sm">{textVisible && <p>Message successfully sent!</p>}</span>
        </label>
        <div>
          <button className="sendMe btn-primary"> Send Message </button>
        </div>
      </form>
    </section>
    </div>
    </div>
</div>
</>
    );
}

export default Contact;