import React from 'react';
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
          <h2>As your trusted advisor, I offer tailored solutions and unwavering support
            to help you navigate the dynamic real estate market with confidence.</h2> 
          <p>Whether you're a first-time buyer, seasoned investor, or seeking to sell your property, I'm here to make your real estate dreams a reality.
           </p>
          <div className='meat'>
          <Link to="/Contact Me">
          <button  className="contactBtn">
              Let's Talk
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