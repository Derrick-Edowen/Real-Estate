import React, { useState, useEffect } from 'react';
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import './Indexq.css'

const Questions = () => {
  useEffect(() => {
    // Load Google CSE API script dynamically
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=662972074485b44cf'; // Replace with your Search Engine ID
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
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

  return (
    <>
        <div className="quests" style={imageStyle}>
        <div className='questLay'>
          <h1 className='qTitle'>Have a Question? Ask Away!</h1>
      <div className="gcse-search"></div>
        </div>
        </div>
        </>
  );
};

export default Questions;
