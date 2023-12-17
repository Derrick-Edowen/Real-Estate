import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import placeHolder  from '../../Assets/Images/rahlogo-placeholder.png'
import './Index.css'

function Header() {
  const [navActive, setNavActive] = useState(false);

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  const closeMenu = () => {
    setNavActive(false);
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
    if (window.innerWidth <= 1200) {
      closeMenu();
    }
  }, []);

  return (
    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <div className="heading">
        <h2>John Smith</h2>
        <h3>Real Estate Sales Representative</h3>
        
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
            <Link
              onClick={closeMenu}
              activeClass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Home"
              className="navbar--content"
            >
              Home
            </Link>
          </li>
          <li className="dropdown">
            <span
              onClick={toggleNav}
              className="navbar--content"
            >
              Find Listings <span className="arrow">&#9660;</span>
            </span>
            <div className="dropdown-content">
              <Link
                onClick={closeMenu}
                to="/ForRent"
                className="navbar--content"
              >
                For Rent
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
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Calculator"
              className="navbar--content"
            >
              Mortgage Calculator
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Questions"
              className="navbar--content"
            >
              Questions
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              activeClass="navbar--active-content"
              spy={true}
              smooth={true}
              offset={-70}
              duration={1000}
              to="/Contact"
              className="navbar--content"
            >
              Contact
            </Link>
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