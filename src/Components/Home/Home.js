import React, { useState, useEffect } from 'react';
import ActiveList from '../ActiveList/ActiveListing';
import Contact from '../Contact/Contact';
import './Index.css';
import { useNavigate } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import Logo from '../../Assets/Images/logo2.PNG'

function Home() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const [banner, setBanner] = useState('');
  const [message, setMessage] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    fetchBanner();
    fetchMessage();

    // Show the lightbox 4 seconds after the component mounts
    const timer = setTimeout(() => setShowLightbox(true), 4000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await fetch('/banner');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBanner(data[0]?.banner || '');
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await fetch('/message');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data[0]?.message || '');
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearchClick = () => {
    if (city.trim() === '') {
      alert('Please enter a city name.');
      return;
    }
  
    // Define the search parameters with only the address
    const newSearchParams = {
      address: city,
    };
  
    // Navigate to the find listings page with the search parameters as state
    navigate('/Find Listings | Property Search', { state: { searcherParams: newSearchParams } });
  };

  // Close lightbox handler
  const closeLightbox = () => setShowLightbox(false);

  return (
    <>
      <div className="homePage">
        <img src='https://storage.googleapis.com/realestate-images/luxliving.jpg' className='splasher' alt='Home Background' />
        <div className='splasher-overlay'>
          <div className='titCard'>[ Banner State ]{banner}</div>
          <p className='messCard'>[ Message State ]{message}</p>
          <div className='discover'>
            <div className="searchBar-container">
              <div className='descTexcjn'>Find Your New Home</div>
              <input
                type="text"
                placeholder="Enter City Name"
                className="searchInput"
                required
                value={city}
                onChange={handleCityChange}
              />
              <button
                className="searchButton"
                onClick={handleSearchClick}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <Contact />
      {showLightbox && (
        <div className="lightbox9" onClick={closeLightbox}>
          <div className="lightbox9-content" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox9-close" onClick={closeLightbox}>&times;</span>
            <div className="lightbox9-image">
              <img src={Logo} alt="Disclaimer" />
            </div>
            <div className="lightbox9-text">
              <p className='descTexcp'>
                Welcome to One Estate Web Services Sample site. 
                This website is used to demonstrate to clients the design and functionality that is 
                provided to all One Estate Web Services client websites. Please note all content found inside [ brackets ] 
                is subject to change and is used for sample purposes. When your website is in development this content will be replaced with your information or 
                you will be able to change it independently. Ready to have your own personal One Estate Web services Real Estate web site, send us an email to get started! <br/><br/>
                <a href="mailto:oneestatewebservices@outlook.com" style={{color: 'black'}}>oneestatewebservices@outlook.com</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

