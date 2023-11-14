import React, { useState, useEffect } from 'react';
import image1 from '../../Assets/Images/living1.jpg'                                                                            
import image2 from '../../Assets/Images/backyard1.jpg'
import image3 from '../../Assets/Images/yard1.jpg'
import image4 from '../../Assets/Images/house1.jpg'
import image5 from '../../Assets/Images/kitchen1.jpg'
import man from  '../../Assets/Images/man2.png'
import './Index.css'



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

    return (
        
<div className="contact" style={imageStyle}>
        <div className='underLay'>
        Contact Page 
        <img src={man} alt='man'></img>
        </div>
      </div>

    );
}

export default Contact;