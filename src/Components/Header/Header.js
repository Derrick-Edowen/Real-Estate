import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import './Index.css'
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import woman100 from '../../Assets/Images/woman100.jpg';
import silo from '../../Assets/Images/YourPhotoHEre.jpg'

function Header() {
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible3, setDropdownVisible3] = useState(false);
  const [dropdownVisible4, setDropdownVisible4] = useState(false);


  const [navActive, setNavActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNav = () => {
    
    setNavActive(!navActive);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible3(false);
    setDropdownVisible4(false);

  };

  const handleClick1 = () => {
    setDropdownVisible1(!dropdownVisible1);
    setDropdownVisible2(false);
    setDropdownVisible3(false);
    setDropdownVisible4(false);

    setNavActive(false); // Close the dropdown menu
  };
  
  const handleClick2 = () => {
    setDropdownVisible2(!dropdownVisible2);
    setDropdownVisible1(false);
    setDropdownVisible3(false);
    setDropdownVisible4(false);

    setNavActive(false); // Close the dropdown menu
  };
  
  const handleClick3 = () => {
    setDropdownVisible3(!dropdownVisible3);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible4(false);

  };
  const handleClick4 = () => {
    setDropdownVisible4(!dropdownVisible3);
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible3(false);

  };
  
  const closeMenu = () => {
    setDropdownVisible1(false);
    setDropdownVisible2(false);
    setDropdownVisible3(false);
    setDropdownVisible4(false);
    setNavActive(false);
  };


  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown")) {
        setDropdownVisible1(false);
        setDropdownVisible2(false);
        setDropdownVisible3(false);
        setDropdownVisible4(false);

      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    closeMenu();
  }, [location]);
  return (

    <nav className={`navbar ${navActive ? "active" : ""}`}>
      
      <NavLink to="/Home" className="heading-link">
      <div className="heading">
      <img className='mainimg19' src={silo} alt='main' />      
        <h2>[ Brokerage / Business Icon ]</h2>
        <h4>[ Your Name ]<br/> [ Sales Representative / Broker ]</h4>
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
              to="/Biography | About Me"
              className={`navbar--content ${location.pathname === '/Biography | About Me' ? 'active' : ''}`}
              >
              [Your Name / Biography]
            </NavLink>
          </li>
          <li className={`dropdown ${dropdownVisible3 ? "active" : ""}`}>
    <div
        className={`missin ${location.pathname.includes('Real%20Estate%20Advice%20%7C%20Selling%20Your%20Home') || location.pathname.includes('Real%20Estate%20Advice%20%7C%20Buying%20A%20Home') || location.pathname.includes('Real%20Estate%20Advice%20%7C%20Investing%20In%20Real%20Estate') ? 'active' : ''}`} 
        onClick={handleClick3}
    >
        Real Estate Advice <span className="chevyy"><FontAwesomeIcon icon={faChevronDown} /></span>
        <li
            className={`navbar--content findingList arrow-rotate ${dropdownVisible3 ? "active" : ""}`}
        >
            <FontAwesomeIcon icon={faChevronDown} />
        </li>
  </div>
  <div className={`dropdown-content ${dropdownVisible3 ? "active" : ""}`}>
  <NavLink
          onClick={closeMenu}
          to="/Real Estate Advice | Buying A Home"
          className="navbar--content transformer miker"
        >
      Buying a Home
    </NavLink>
    <NavLink
      onClick={closeMenu}
      to="/Real Estate Advice | Selling Your Home"
      className="navbar--content transformer miker2"
    >
      Selling Your Home
    </NavLink>
    <NavLink
      onClick={closeMenu}
      to="/Real Estate Advice | Investing In Real Estate"
      className="navbar--content transformer miker3"
    >
      Investing in Real Estate
    </NavLink>
  </div>
</li>
<div className={`inter ${dropdownVisible3 ? "active" : ""}`}>
        <li>
            <NavLink
                onClick={closeMenu}
                activeclass="navbar--active-content"
                to="/Real Estate Advice | Buying A Home"
                className="missin scav"
            >
                Buying a Home
            </NavLink>
        </li>
        <li>
            <NavLink
                onClick={closeMenu}
                activeclass="navbar--active-content"
                to="/Real Estate Advice | Selling Your Home"
                className="missin"
            >
                Selling Your Home
            </NavLink>
        </li>
        <li>
            <NavLink
                onClick={closeMenu}
                activeclass="navbar--active-content"
                to="/Real Estate Advice | Investing In Real Estate"
                className="missin"
            >
                Investing in Real Estate
            </NavLink>
        </li>
    </div>
    <li>
            <NavLink
              onClick={closeMenu}
              activeclass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Rental Market Data"
              className={`navbar--content ${location.pathname === '/Rental Market Data' ? 'active' : ''}`}
              >
              Market Data
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
              to="/Find Listings | Property Search"
              className={`navbar--content ${location.pathname === '/Find Listings | Property Search' ? 'active' : ''}`}
              >
              Find Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              activeclass="navbar--active-content"
              smooth={true}
              offset={-70}
              duration={1500}
            onClick={closeMenu}
            to="/Announcements"
              className="navbar--content"
            >
              Announcements
            </NavLink>
          </li>

          <li>
          <ScrollLink
  onClick={closeMenu}
  activeClass="navbar--active-content"
  to="contact"
  smooth={true}
  offset={-100}
  duration={250}
  className="navbar--content"
>
  Contact
</ScrollLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;


