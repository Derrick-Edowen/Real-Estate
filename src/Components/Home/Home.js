import React from 'react';
import { Link } from 'react-router-dom';
import man1 from '../../Assets/Images/man1-PhotoRoom.png';
import woman1 from '../../Assets/Images/woman1.jpg';
import './Index.css';

function Home() {
  // Randomly select either man1 or woman1
  const randomImage = Math.random() < 0.5 ? man1 : woman1;

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
              <button className="contactBtn">
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
