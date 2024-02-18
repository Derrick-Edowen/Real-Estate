import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import placeHolder  from '../../Assets/Images/rahlogo-placeholder.png'
import './Index.css'


function Header() {
  const [arrowRotation, setArrowRotation] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Add state for dropdown visibility
  const [dropdownVisible2, setDropdownVisible2] = useState(false); // Add state for dropdown visibility

  const [navActive, setNavActive] = useState(false);

  const toggleNav = () => {
    setNavActive(!navActive);
    setDropdownVisible(!dropdownVisible);
    setDropdownVisible(false);
    setDropdownVisible2(!dropdownVisible2);
    setDropdownVisible2(false);
  };

  const closeMenu = () => {
    setNavActive(false);
    setDropdownVisible(false);
    setDropdownVisible2(false);

  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1360) {
      closeMenu();
    }
  }, []);
  const handleClick = () => {
    // Action 1: Increment counter
    setDropdownVisible(!dropdownVisible);


  };
  const handleClick2 = () => {
    // Action 1: Increment counter
    setDropdownVisible2(!dropdownVisible2);


  };
  return (
    
    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <div className="heading">
        <h2>John Smith</h2>
        <h3>Sales Representative</h3>
      </div>
      <a
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={toggleNav} 
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
              className="navbar--content"
            >
              Home
            </NavLink>
          </li>
          <li className={`dropdown ${dropdownVisible ? "active" : ""}`}>
            <span
              className={`navbar--content findingList ${dropdownVisible ? "arrow-rotate" : ""}`}
              onClick={handleClick}
              style={{ transform: `rotate(${arrowRotation}deg)` }}
            >
              Find Listings <span className="arrow">&#9660;</span>
            </span>
            <div className={`dropdown-content ${dropdownVisible ? "active" : ""}`}>
              <Link
                onClick={closeMenu}
                to="/ForRent"
                className="navbar--content"
              >
                For Lease
              </Link>
              <Link
                onClick={closeMenu}
                to="/ForSale"
                className="navbar--content"
              >
                For Sale
              </Link>
              <Link
                onClick={closeMenu}
                to="/RecentlySold"
                className="navbar--content"
              >
                Recently Sold
              </Link>
            </div>
          </li>
          <li className={`dropdown ${dropdownVisible2 ? "active" : ""}`}>
            <span
              className={`navbar--content findingList ${dropdownVisible2 ? "arrow-rotate" : ""}`}
              onClick={handleClick2}
              style={{ transform: `rotate(${arrowRotation}deg)` }}
            >
              Calculators <span className="arrow">&#9660;</span>
            </span>
            <div className={`dropdown-content ${dropdownVisible2 ? "active" : ""}`}>
              <Link
                onClick={closeMenu}
                to="/Calculator"
                className="navbar--content"
              >
                Amortization Calculator
              </Link>
              <Link
                onClick={closeMenu}
                to="/RentCalculator"
                className="navbar--content"
              >
                Rent Affordability Calculator
              </Link>
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
              to="/Blog"
              className="navbar--content"
            >
              My Blog
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
              to="/Questions"
              className="navbar--content"
            >
              Search
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
              to="/Contact"
              className="navbar--content"
            >
              Contact
            </NavLink>
          </li>
          <div className="holder">
            <img className="holderImg" src={placeHolder} alt="Placeholder Logo" />
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Header;