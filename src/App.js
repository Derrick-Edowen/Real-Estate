import React from "react";
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

function App() {
  return (
    <div className="App">
      <Router>
        <div>
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
            <Route path="*" element={<div>404 Not Found</div>}></Route>
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
