import React, { useState } from 'react';
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

function Home() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

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
      <img src='https://storage.googleapis.com/realestate-images/luxury.jpg' className='splasher'></img>
      <div className='splasher-overlay'>
      <div className='titCard'>
      [YOUR BANNER STATEMENT]
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
        <Blog />
        <ActiveList />
        <Contact />
        </>
  );
}

export default Home;

