import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import man1 from '../../Assets/Images/man1-PhotoRoom.png';
import woman1 from '../../Assets/Images/woman1.jpg';
import './Index.css';

function Home() {
  const [contactBtnClass, setContactBtnClass] = useState('contactBtn');

  useEffect(() => {
    const classes = ['contactBtn', 'contactBtn second', 'contactBtn third', 'contactBtn fourth'];
    const currentIndex = parseInt(localStorage.getItem('contactBtnClassIndex')) || 0;
    const nextIndex = (currentIndex + 1) % classes.length;
    setContactBtnClass(classes[currentIndex]);
    localStorage.setItem('contactBtnClassIndex', nextIndex);
  }, []);

  return (
    <div className="homePage">
      <div className='overLay'>
        <img className='mainimg' src={man1} alt='main'></img>
        <div className='textBox'>
          <h1>One Estate Web Services</h1>
          <h2>Subscribe for personalized REALTOR&reg; websites</h2>
          <p>
            Work 1 on 1 with our developers to build your custom website, and improve your online presence today!
          </p>
          <div className='meat'>
            <Link to="/Contact Me">
            <button className={contactBtnClass}>
                Let's Talk
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
