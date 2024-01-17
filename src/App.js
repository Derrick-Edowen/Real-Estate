import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import Calculator from './Components/Calculator/Calculator';
import Contact from './Components/Contact/Contact';
import ForSale from './Components/ForSale/ForSale';
import ForRent from './Components/ForRent/ForRent';
import RecentlySold from './Components/RecentlySold/RecentlySold';
import RentCalculator from "./Components/RentCalculator/RentCalculator";
import Questions from "./Components/Questions/Questions";
import Test from "./Components/Test/Test"
import image1 from './Assets/Images/living1.jpg'                                                                            
import image2 from './Assets/Images/backyard1.jpg'
import image3 from './Assets/Images/yard1.jpg'
import image4 from './Assets/Images/house1.jpg'
import image5 from './Assets/Images/kitchen1.jpg'

function App() {
  const [images] = useState([image1, image2, image3, image4, image5]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 14000);
  
      return () => clearInterval(interval);
    }, [images]);
  
    const imageStyle = {
      backgroundImage: `url(${images[currentIndex]})`,
    };
  return (
   <div className="App" style={imageStyle}>
    
      <Router>
      <Header />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Home" element={<Home />}></Route>
            <Route path="/Calculator" element={<Calculator />}></Route>
            <Route path="/ForSale" element={<ForSale />}></Route>
            <Route path="/ForRent" element={<ForRent />}></Route>
            <Route path="/RecentlySold" element={<RecentlySold />}></Route>
            <Route path="/RentCalculator" element={<RentCalculator />}></Route>
            <Route path="/Contact" element={<Contact />}></Route>
            <Route path="/Questions" element={<Questions />}></Route>
            <Route path="/test" element={<Test />}></Route>
            <Route path="*" element={<div>404 Not Found</div>}></Route>
          </Routes>
          <Footer />
      </Router>
    </div>
  );
}

export default App;
