import image1 from './Assets/Images/living1.jpg'                                                                            
import image2 from './Assets/Images/backyard1.jpg'
import image3 from './Assets/Images/yard1.jpg'
import image4 from './Assets/Images/house1.jpg'
import image5 from './Assets/Images/kitchen1.jpg'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import Calculator from './Components/Calculator/Calculator';
import Contact from './Components/Contact/Contact';
import ForSale from './Components/ForSale/ForSale';
import ForRent from './Components/ForRent/ForRent';
import RecentlySold from './Components/RecentlySold/RecentlySold';
import RentCalculator from './Components/RentCalculator/RentCalculator';
import Questions from './Components/Questions/Questions';
import Login from './Components/Login/Login';
import Blog from './Components/Blog/Blog';

function App() {
  const images = [image1, image2, image3, image4, image5];
  const randomIndex = Math.floor(Math.random() * images.length);
  const [currentIndex] = useState(randomIndex);

  // Preload images
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  const imageStyle = {
    backgroundImage: `url(${images[currentIndex]})`,
  };

  return (
    <>
      <Router>
        <Header />
        <div className="App" style={imageStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Calculator" element={<Calculator />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/ForSale" element={<ForSale />} />
            <Route path="/ForRent" element={<ForRent />} />
            <Route path="/RecentlySold" element={<RecentlySold />} />
            <Route path="/RentCalculator" element={<RentCalculator />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/Login" element={<Login />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
