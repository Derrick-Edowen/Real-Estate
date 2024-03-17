import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import man from  '../../Assets/Images/man2.png'
import emailjs from '@emailjs/browser';
import './contact.css'
import GoogleMapReact from 'google-map-react';

const Marker = () => <div style={{ color: 'red' }}>📍</div>;

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
      <section className='venn-diagram'>
        <div className='looki'>
      <img className='conImg' src={man} alt='man'></img>
      <div className='standIn2'> 
      John Smith<br/>
      TEL - 647-123-4567<br/>
      smithrealestate@gmail.com
      </div>
      </div>
      <div className='standIn'>
        Office - 123-456-7890<br/>
        Fax - 647-765-4321<br/><br/>
        Office Location:
        <div style={{ height: '200px', width: '528px' }}>
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
          <button className="sendMe btn-primary"> Submit </button>
          
        </div>
      </form>
    </section>
    </div>
    );
}

export default Contact;