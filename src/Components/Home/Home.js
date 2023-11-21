import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import man1 from  '../../Assets/Images/man1-PhotoRoom.png'
import Header from '../Header/Header';
import './Index.css'
//Get better pictures
//Incorporate Google Translate

function Home() {
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
  
    return (
      <>
      <div className='home' style={imageStyle}>
      <div className="homePage">
        <div className='overLay'>
          <div  className='imgContainer'>
        <img className='mainimg' src={man1} alt='man'></img>
        <div className='textBox'>
          <h1>Let me help you</h1> 
          <h2>find your dream home in the GTA!</h2>
          <p>There are a lot of moving parts when it comes to brokerage and REALTOR® websites.
          Over the years our real estate websites have evolved and delivers results.</p>
          <Link to="/Contact">
          <button  className="contactBtn">
              Lets Talk!
          </button>
          </Link>
        </div>
        </div>
        </div>
      </div>
      </div>
      </>
    );
  };
export default Home;