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
      <a
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={toggleNav}
      >
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
      </a>
      <div className={`navbar--items ${navActive ? "active" : ""}`}>
        <div>
        <h1>John Smith</h1>
        <h2>Real Estate Sales Representive</h2>
        </div>
        <ul>
          <li>
            <Link
              onClick={closeMenu}
              to="/Home"
              className="navbar--content"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              to="/Listings"
              className="navbar--content"
            >
              Listings
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              to="/About"
              className="navbar--content"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenu}
              to="/Contact"
              className="navbar--content"
            >
              Contact
            </Link>
          </li>
        </ul>
        <div>
        <img className="holderImg" src={placeHolder} alt="Placeholder Logo" />
        </div>
      </div>
    </nav>
  );
}

export default Header;