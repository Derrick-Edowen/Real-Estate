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
function Home() {
  return (
    <>
    <div className="homePage">
      <img src='https://storage.googleapis.com/realestate-images/luxury.jpg' className='splasher'></img>
      <div className='splasher-overlay'>
      <div className='titCard'>
      [YOUR BANNER STATEMENT]
      </div>
      <div className='apps'>
      <div className='biglinks'>
  <div className='gote'>
    <FontAwesomeIcon icon={faHouseCircleExclamation} className="icon" size="2xl" />
  </div>
  <div className='text'>Find Properties</div>
</div>

        <div className='biglinks'>
        <div className='gote'><FontAwesomeIcon icon={faCalculator} className="icon" size="2xl" /></div>
        <div className='text'>Calculators</div>

        </div>
        <div className='biglinks'>
        <div className='gote'><FontAwesomeIcon icon={faBullhorn} className="icon" size="2xl" /></div>
        <div className='text'>Announcements</div>

        </div>
        <div className='biglinks'>
        <div className='gote'><FontAwesomeIcon icon={faPhoneVolume} className="icon" size="2xl" /></div>
        <div className='text'>Contact</div>

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

