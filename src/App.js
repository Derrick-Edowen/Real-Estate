
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
import Access from './Components/AgentAccess/Access';
import PropertyDetails from './Components/PropertyDetails/PropertyDetails';
import Announce from './Components/Announce/Announce';
import Service from './Components/Service/Service';
import Mission from './Components/Mission/Mission';
import Privacy from './Components/Privacy/Privacy';
import Buying from './Components/Buying/Buying';
import Selling from './Components/Selling/Selling';
import Investing from './Components/Investing/Investing';
import Lost from './Components/Lost/Lost';
import MarketRent from './Components/MarketRent/MarketRent';
import MarketSale from './Components/MarketSale/MarketSale';

function App() {
  const location = useLocation();
  useEffect(() => {
    let pageTitle = decodeURIComponent(location.pathname.replace(/^\/+/, '')); // Remove leading '/'
    if (pageTitle === "") {
      pageTitle = "Home";
    }
    document.title = `${pageTitle} - One Estate Web Services`;
  }, [location]);
  useEffect(() => {
    const scriptId = 'adsbygoogle-script';
    if (!document.getElementById(scriptId)) {
      const adsbygoogleScript = document.createElement('script');
      adsbygoogleScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      adsbygoogleScript.async = true;
      adsbygoogleScript.crossOrigin = 'anonymous';
      adsbygoogleScript.id = scriptId;
      document.head.appendChild(adsbygoogleScript);
    }
  }, []);
  return (
    <>
      <Captain />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Biography | About Me" element={<Bio />} />
        <Route path="/Calculators | Mortgage Calculator" element={<Calculator />} />
        <Route path="/Announcements" element={<Blog />} />
        <Route path="/Find Listings | Property Search" element={<ForRent />} />
        <Route path="/Contact Me" element={<Contact />} />
        <Route path="/Pricing & Subscriptions" element={<Pricing />} />
        <Route path="/Agent Access" element={<Access />} />
        <Route path="/Terms of Service" element={<Service />} />
        <Route path="/Privacy Policy" element={<Privacy />} />
        <Route path="/Our Mission" element={<Mission />} />
        <Route path="/Real Estate Advice | Buying A Home" element={<Buying />} />
        <Route path="/Real Estate Advice | Selling Your Home" element={<Selling />} />
        <Route path="/Real Estate Advice | Investing In Real Estate" element={<Investing />} />
        <Route path="/Announcements/:title" element={<Announce />} />
        <Route path="/Property-Details/:address" element={<PropertyDetails />} />
        <Route path="/Nearby-Property-Details/:address" element={<PropertyDetails />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Rental Market Data" element={<MarketRent />} />
        <Route path="/Purchase Market Data" element={<MarketSale />} />

        <Route path="*" element={<Lost />} />
      </Routes>
    </>
  );
}

export default App;
