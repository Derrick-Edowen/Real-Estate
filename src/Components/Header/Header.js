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
            <span
              className={`navbar--content findingList arrow-rotate ${dropdownVisible1 ? "active" : ""}`}
              onClick={handleClick1} 
            >
              Find Listings <span className="arrow">&#9660;</span>
            </span>
            <div className={`dropdown-content ${dropdownVisible1 ? "active" : ""}`}>
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
              className={`navbar--content findingList arrow-rotate ${dropdownVisible2 ? "active" : ""}`}
              onClick={handleClick2} 
            >
              Calculators <span className="arrow">&#9660;</span>
            </span>
            <div className={`dropdown-content ${dropdownVisible2 ? "active" : ""}`}>
              <Link
                onClick={closeMenu}
                to="/Calculator"
                className="navbar--content"
              >
                Mortgage Calculator
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


