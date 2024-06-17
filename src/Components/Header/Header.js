import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import './Index.css'
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

function Header() {
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const [navActive, setNavActive] = useState(false);
  const location = useLocation();


  
  const toggleNav = () => {
    
    setNavActive(!navActive);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible3(false);

  };

  const closeMenu = () => {
    setNavActive(false);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible3(false);

  };

  const handleClick1 = () => {
    setDropdownVisible1(!dropdownVisible1);
    setDropdownVisible2(false);
    setDropdownVisible3(false);
    setNavActive(false); // Close the dropdown menu
  };
  
  const handleClick2 = () => {
    setDropdownVisible2(!dropdownVisible2);
    setDropdownVisible1(false);
    setDropdownVisible3(false);
    setNavActive(false); // Close the dropdown menu
  };
  
  const handleClick3 = () => {
    setDropdownVisible3(!dropdownVisible3);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setNavActive(false); // Close the dropdown menu
  };
  
  

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown")) {
        setDropdownVisible1(false);
        setDropdownVisible2(false);
        setDropdownVisible3(false);

      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (

    <nav className={`navbar ${navActive ? "active" : ""}`}>
      
      <NavLink to="/Home" className="heading-link">
      <div className="heading">      
        <h2>[Your Brokerage/Business]</h2>
        <h4>[Your Name]<br/> [Sales Representative / Broker]</h4>
      </div>
    </NavLink>
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
              to="/Bio"
              className={`navbar--content ${location.pathname === '/Bio' ? 'active' : ''}`}
              >
              [BIO / YOUR NAME]
            </NavLink>
          </li>
          <li className={`dropdown ${dropdownVisible3 ? "active" : ""}`}>
          <div className={`missin ${location.pathname.includes('Find%20Listings%20%7C%20For%20Lease') || location.pathname.includes('Find%20Listings%20%7C%20For%20Sale') || location.pathname.includes('Find%20Listings%20%7C%20Recently%20Sold') ? 'active' : ''}`} 
          onClick={handleClick3}>REAL ESTATE ADVICE
              <li
                className={`navbar--content findingList arrow-rotate ${dropdownVisible3 ? "active" : ""} `}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </li>
            </div>
            <div className={`dropdown-content ${dropdownVisible3 ? "active" : ""}`}>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Sale"
                className="navbar--content transformer"
              >
                Buying a Home
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Lease"
                className="navbar--content transformer"
              >
                Selling Your Home
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | Recently Sold"
                className="navbar--content transformer"
              >
                Investing in Real Estate
              </NavLink>
            </div>
          </li>
          <li className={`dropdown ${dropdownVisible1 ? "active" : ""}`}>
          <div className={`missin ${location.pathname.includes('Find%20Listings%20%7C%20For%20Lease') || location.pathname.includes('Find%20Listings%20%7C%20For%20Sale') || location.pathname.includes('Find%20Listings%20%7C%20Recently%20Sold') ? 'active' : ''}`} 
          onClick={handleClick1}>FIND LISTINGS
              <li
                className={`navbar--content findingList arrow-rotate ${dropdownVisible1 ? "active" : ""} `}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </li>
            </div>
            <div className={`dropdown-content ${dropdownVisible1 ? "active" : ""}`}>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Sale"
                className="navbar--content transformer"
              >
                For Sale
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | For Lease"
                className="navbar--content transformer"
              >
                For Lease
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | Recently Sold"
                className="navbar--content transformer"
              >
                Recently Sold
              </NavLink>
            </div>
          </li>
          <li className={`dropdown ${dropdownVisible2 ? "active" : ""}`}>
          <div className={`missin ${location.pathname.includes('Calculators%20%7C%20Mortgage%20Calculator') || location.pathname.includes('Calculators%20%7C%20Rent%20Affordability%20Calculator') ? 'active' : ''}`}
           onClick={handleClick2}>CALCULATORS
            <li
              className={`navbar--content findingList big-rotate2 ${dropdownVisible2 ? "active" : ""}`}
              
            >
               <FontAwesomeIcon icon={faChevronDown} />
            </li>
            </div>
            <div className={`dropdown-content3 ${dropdownVisible2 ? "active" : ""}`}>
              <NavLink
                onClick={closeMenu}
                to="/Calculators | Mortgage Calculator"
                className="navbar--content transformer"
              >
                Mortgage Calculator
              </NavLink>
              <NavLink
                onClick={closeMenu}
                to="/Calculators | Rent Affordability Calculator"
                className="navbar--content transformer"
              >
                Lease Calculator
              </NavLink>
            </div>
          </li>
          <li>
            <ScrollLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              smooth={true}
              offset={-70}
              duration={2000}
              to="announcement"
              className="navbar--content"
            >
              ANNOUNCEMENTS
            </ScrollLink>
          </li>
          <li>
          <ScrollLink
  onClick={closeMenu}
  activeClass="navbar--active-content"
  to="contact"
  smooth={true}
  offset={-100}
  duration={2000}
  className="navbar--content"
>
  CONTACT
</ScrollLink>
          </li>
          <li>
            <NavLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Pricing"
              className={`navbar--content ${location.pathname === 'Pricing' ? 'active' : ''}`}
              >
              [PRICING & SUBSCRIPTIONS]
            </NavLink>
          </li>

       
        </ul>
      </div>
    </nav>
  );
}

export default Header;


