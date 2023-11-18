import React, { useState, useEffect, useRef } from 'react';
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import man from  '../../Assets/Images/man2.png'
import Header from '../Header/Header';
import emailjs from '@emailjs/browser';
import './Index.css'
import Footer from '../Footer/Footer';



function Contact() {
    const [images] = useState([image1, image2, image3, image4, image5]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 15000);
  
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
      <Header />

        <div className='contactPage'>
<div className="contact" style={imageStyle}>
        <div className='underLay'>
        <img className='conImg' src={man} alt='man'></img>
        
      
      <div className='contactForm'>
      <section id="Contact" className="contact--section">
      <div>
        <h3>Lets Connect!</h3>
      </div>
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
              placeholder='Example: Lease for $2500/month or Purchase for $1,500,000'
            />
          </label>
        <label htmlFor="message" className="contact--label">
          <span className="text-md">Message</span>
          <textarea
            className="contact--input text-md"
            id="message"
            rows="4"
            name="message"
            placeholder="Type your message..."
          />
        </label>
        <label htmlFor="checkboc" className="checkbox--label">
          <span className="text-sm">{textVisible && <p>Message successfully sent!</p>}</span>
        </label>
        <div>
          <button className="btn btn-primary contact--form--btn"> Send </button>
        </div>
      </form>
    </section>
    </div>
    </div>
    </div>
</div>
</>
    );
}

export default Contact;