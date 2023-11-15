import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
//import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
//import Footer from './Components/Footer/Footer';
import Listings from './Components/Listings/Listings';
import Calculator from './Components/Calculator/Calculator';
import Contact from './Components/Contact/Contact';



function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Home" element={<Home />}></Route>
            <Route path="/Listings" element={<Listings />}></Route>
            <Route path="/Calculator" element={<Calculator />}></Route>
            <Route path="/Contact" element={<Contact />}></Route>
            <Route path="*" element={<div>404 Not Found</div>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
