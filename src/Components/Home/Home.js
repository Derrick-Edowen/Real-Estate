import React, { useState, useEffect } from 'react';
import ActiveList from '../ActiveList/ActiveListing';
import Contact from '../Contact/Contact';
import './Index.css';
import { useNavigate } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';

function Home() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const [banner, setBanner] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBanner();
    fetchMessage();
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
  
  return (
    <>
    <div className="homePage">
      <img src='https://storage.googleapis.com/realestate-images/luxliving.jpg' className='splasher'></img>
      <div className='splasher-overlay'>
      <div className='titCard'> {banner} </div>
      <p className='messCard'> {message} </p>
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
        <Element name="announcement" className="announcement-section">
        </Element>
        <ActiveList />
        <Contact />
        </>
  );
}

export default Home;

