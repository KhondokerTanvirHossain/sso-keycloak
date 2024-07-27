import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

export default function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg mainColor navbar-dark nav-text py-3">
        <div className="container">
          <Link className="navbar-brand fs-3" to="/home">START FRAMEWORK</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
         
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/portfolio">Portfolio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contacts">Contacts</Link>
                </li>
                <li className="nav-item">
                  <LogoutButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}