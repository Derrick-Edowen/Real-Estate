import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import man1 from  '../../Assets/Images/man1-PhotoRoom.png'
import './Index.css'

//Get better pictures
//Incorporate Google Translate

function Home() {

  
    return (
      <>
      <div className="homePage">
        <div className='overLay'>
        <img className='mainimg' src={man1} alt='man'></img>
        <div className='textBox'>
          <h1>Let me help you</h1> 
          <h2>find your dream home in the GTA!</h2>
          <p>There are a lot of moving parts when it comes to brokerage and REALTOR® websites.
          Over the years our real estate websites have evolved and delivers results.</p>
          <div className='meat'>
          <Link to="/Contact Me">
          <button  className="contactBtn">
              Let's Talk!
          </button>
          </Link>
          </div>
        </div>
        </div>
      </div>
      </>
    );
  };
export default Home;