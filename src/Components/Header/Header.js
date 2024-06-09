import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import './Index.css'
import manH from '../../Assets/Images/man1-PhotoRoom2.png'
import { useLocation } from 'react-router-dom';

function Header() {
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const location = useLocation();


  
  const toggleNav = () => {
    
    setNavActive(!navActive);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
  };

  const closeMenu = () => {
    setNavActive(false);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
  };

  const handleClick1 = () => {
    setDropdownVisible1(!dropdownVisible1);
    setDropdownVisible2(false);
  };

  const handleClick2 = () => {
    setDropdownVisible2(!dropdownVisible2);
    setDropdownVisible1(false);
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown")) {
        setDropdownVisible1(false);
        setDropdownVisible2(false);
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (

    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <div className="heading">      
          <h2>One Estate Web Services</h2>
      </div>
      <a
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={toggleNav}
        aria-label="Toggle Navigation"

      >
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
      </a>
      <div className={`navbar--items ${navActive ? "active" : ""}`}>
        <ul>
          <li>
            <NavLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Home"
              className={`navbar--content ${location.pathname.includes('') ? 'active' : ''}`}
            >
              Home
            </NavLink>
          </li>
          <li className={`dropdown ${dropdownVisible1 ? "active" : ""}`}>
          <div className={`missin ${location.pathname.includes('Find%20Listings%20%7C%20For%20Lease') || location.pathname.includes('Find%20Listings%20%7C%20For%20Sale') || location.pathname.includes('Find%20Listings%20%7C%20Recently%20Sold') ? 'active' : ''}`} onClick={handleClick1}>Find Listings
              <li
                className={`navbar--content findingList arrow-rotate ${dropdownVisible1 ? "active" : ""} `}
              >
                &#9660;
              </li>
            </div>
            <div className={`dropdown-content ${dropdownVisible1 ? "active" : ""}`}>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Sale"
                className="navbar--content transformer"
              >
                FOR SALE
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Lease"
                className="navbar--content transformer"
              >
                FOR LEASE
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | Recently Sold"
                className="navbar--content transformer"
              >
                RECENTLY SOLD
              </NavLink>
            </div>
          </li>
          <li className={`dropdown ${dropdownVisible2 ? "active" : ""}`}>
          <div className={`missin ${location.pathname.includes('Calculators%20%7C%20Mortgage%20Calculator') || location.pathname.includes('Calculators%20%7C%20Rent%20Affordability%20Calculator') ? 'active' : ''}`} onClick={handleClick2}>Calculators
            <li
              className={`navbar--content findingList big-rotate2 ${dropdownVisible2 ? "active" : ""}`}
              
            >
               &#9660;
            </li>
            </div>
            <div className={`dropdown-content ${dropdownVisible2 ? "active" : ""}`}>
              <NavLink
                onClick={closeMenu}
                to="/Calculators | Mortgage Calculator"
                className="navbar--content transformer"
              >
                MORTGAGE CALCULATOR
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Calculators | Rent Affordability Calculator"
                className="navbar--content transformer"
              >
                LEASE CALCULATOR
              </NavLink>
            </div>
          </li>
          <li>
            <NavLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Announcements"
              className="navbar--content"
            >
              Announcements
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Contact Me"
              className="navbar--content"
            >
              Contact
            </NavLink>
          </li>
<li>
  <a
    href="https://buy.stripe.com/4gw3ekg8HeBSfKwbII"
    target="_blank"
    rel="noopener noreferrer"
    className="navbar--content"
    onClick={closeMenu}
  >
    Pricing / Subscriptions
  </a>
</li>

       
        </ul>
      </div>
    </nav>
  );
}

export default Header;


