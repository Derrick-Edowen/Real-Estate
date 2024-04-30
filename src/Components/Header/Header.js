import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import placeHolder from '../../Assets/Images/rahlogo-placeholder.png'
import './Index.css'
import manH from '../../Assets/Images/man1-PhotoRoom2.png'

function Header() {
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [navActive, setNavActive] = useState(false);

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
        <img src={manH} className="headerImg"></img>
        <h2>John Smith <br />
        Sales Representative</h2>
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
          <li className={`dropdown ${dropdownVisible1 ? "active" : ""}`}>
          <div className="missin" onClick={handleClick1}>Find Listings
            <li
              className={`navbar--content findingList arrow-rotate ${dropdownVisible1 ? "active" : ""}`}
              
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
              <NavLink
                onClick={closeMenu}
                to="/Find Listings | Recently Sold"
                className="navbar--content transformer"
              >
              MLS NUMBER
              </NavLink>
            </div>
          </li>
          <li className={`dropdown ${dropdownVisible2 ? "active" : ""}`}>
          <div className="missin" onClick={handleClick2}>Calculators
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
          <div className="holder">
            <img className="holderImg" src={placeHolder} alt="Placeholder Logo" />
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Header;


