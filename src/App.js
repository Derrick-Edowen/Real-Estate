
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import './App.css';
import ScrollToTop from './ScrollTop';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Hero from './Components/Hero/Hero';
import Footer from './Components/Footer/Footer';
import Calculator from './Components/Calculator/Calculator';
import Contact from './Components/Contact/Contact';
import ForSale from './Components/ForSale/ForSale';
import ForRent from './Components/ForRent/ForRent';
import RecentlySold from './Components/RecentlySold/RecentlySold';
import RentCalculator from './Components/RentCalculator/RentCalculator';
import Login from './Components/Login/Login';
import Blog from './Components/Blog/Blog';
import ActiveList from './Components/ActiveList/ActiveListing';
import Captain from './Components/Captain/Captain';
import Pricing from './Components/Pricing/Pricing';
import Bio from './Components/Bio/Bio';
import PropertyDetails from './Components/PropertyDetails/PropertyDetails';


function App() {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = decodeURIComponent(location.pathname.replace(/^\/+/, '')); // Remove leading '/'
    if (pageTitle === "") {
      pageTitle = "Home";
    }
    document.title = `${pageTitle} - One Estate Web Services`;
  }, [location]);

  return (
    <>
      <Captain />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Bio" element={<Bio />} />
        <Route path="/Calculators | Mortgage Calculator" element={<Calculator />} />
        <Route path="/Announcements" element={<Blog />} />
        <Route path="/Find Listings | For Sale" element={<ForSale />} />
        <Route path="/Find Listings | For Lease" element={<ForRent />} />
        <Route path="/Find Listings | Recently Sold" element={<RecentlySold />} />
        <Route path="/Calculators | Rent Affordability Calculator" element={<RentCalculator />} />
        <Route path="/Contact Me" element={<Contact />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/Property-Details/:address" element={<PropertyDetails />} />
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
