import React from 'react';
import './header.scss';
import HamburgerIcon from '../../images/brg.svg';
import UVULogo from '../../images/uvu-logo.svg';
import SearchIcon from '../../images/search.svg';

function Header() {
  return (
    <div className="header-wrap">
      <div className="header-left">
        <div className="menu-section">
          <img src={HamburgerIcon} alt="hamburger menu" />
        </div>
        <div className="logo-section">
          <img src={UVULogo} alt="UVU Logo" />
        </div>
        <div className="title-section">
          <h2>ACADEMIC SCHEDULING</h2>
        </div>
      </div>
      <div className="search-section">
        <img src={SearchIcon} alt="Search Icon" />
      </div>
    </div>
  );
}

export default Header;
