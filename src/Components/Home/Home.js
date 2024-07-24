import React, { useState, useEffect } from 'react';
import Hero from '../Hero/Hero';
import Blog from '../Blog/Blog';
import ActiveList from '../ActiveList/ActiveListing';
import Contact from '../Contact/Contact';
import { Link } from 'react-router-dom';
import man1 from '../../Assets/Images/man1-PhotoRoom.png';
import woman1 from '../../Assets/Images/smiling-blonde-business-woman-posing-with-crossed-arms.png';
import './Index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faBullhorn, faPhoneVolume, faHouseCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';

function Home() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [banner, setBanner] = useState('');

  useEffect(() => {
    fetchBanner();
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
  useEffect(() => {
    if (location.state && location.state.scrollToAnnouncement) {
      scroller.scrollTo('announcement', {
        duration: 300,
        delay: 0,
        smooth: 'easeInOutQuad',
        offset: -180, // Adjust offset as needed
      });
    }
  }, [location]);
  
  return (
    <>
    <div className="homePage">
      <img src='https://storage.googleapis.com/realestate-images/luxury.jpg' className='splasher'></img>
      <div className='splasher-overlay'>
      <div className='titCard'>
      {banner}
      </div>
      <div className='discover'>
      <div className="searchBar-container">
        <div className='descTexcjn'> Find Your New Home </div>
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
        <Hero />
        <Element name="announcement" className="announcement-section">
        </Element>
        <ActiveList />
        <Contact />
        </>
  );
}

export default Home;

