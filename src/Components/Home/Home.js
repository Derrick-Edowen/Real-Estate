import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import man1 from '../../Assets/Images/man1-PhotoRoom.png';
import woman1 from '../../Assets/Images/smiling-blonde-business-woman-posing-with-crossed-arms.png';
import './Index.css';

function Home() {
  const [mainImg, setMainImg] = useState([]);
  const [imgClass, setImgClass] = useState('mainimg');

  useEffect(() => {
    // Function to randomly select between man1 and woman1
    const selectRandomImage = () => {
      return Math.random() > 0.5 ? man1 : woman1;
    };

    // Select a random image
    const randomImage = selectRandomImage();

    // Set the random image as the current mainImg
    setMainImg(randomImage);

    // Update the class based on the random image
    setImgClass(randomImage === man1 ? 'newmainimg' : 'mainimg');
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="homePage">
      <img className={imgClass} src={mainImg} alt='main' />
      <div className='textBox'>
        <h1>One Estate Web Services</h1>
        <h2>Personal REALTOR&reg; websites at an affordable price</h2>
        <p>
          Work one on one with our developers to build your custom website, and improve your online presence today!
        </p>
        <div className='meat'>
          <Link to="/Contact Me">
            <button className="contactBtn">
              Let's Talk
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

