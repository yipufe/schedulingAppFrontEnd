import React from 'react';
import './footer.scss';
import FBLogo from '../../images/facebook.svg';
import InstaLogo from '../../images/instagram.svg';
import TwitterLogo from '../../images/twitter.svg';

function Footer() {
  return (
    <div className="footer-wrap">
      <div className="footer-top">
        <p>
          Academic Scheduling | academic_scheduling@uvu.edu | (801) 863-8770 |
          Room BA-201
        </p>
      </div>
      <div className="footer-mid">
        <div>
          <h3>ABOUT UVU</h3>
          <p>History</p>
          <p>Office of the President</p>
          <p>Inclusion & Diversity</p>
          <p>Newsroom</p>
          <p>Accreditation</p>
        </div>
        <div>
          <h3>HELP</h3>
          <p>Get Help</p>
          <p>Search</p>
          <p>Emergency</p>
          <p>Accessibility</p>
          <p>Title IX / Equal Opportunity</p>
        </div>
        <div>
          <h3>CONTACT</h3>
          <p>Contact Us</p>
          <p>Español</p>
          <p>Employment</p>
          <p>Maps</p>
          <p>Give to UVU</p>
        </div>
      </div>
      <div className="footer-bottom">
        <h3>UTAH VALLEY UNIVERSITY</h3>
        <p>
          800 West University Parkway, Orem, UT 84058 &bull; (801) 863-8888
          &bull; © Utah Valley University
        </p>
        <p>
          Terms of Use | Privacy Statement | Copyright Complaints |
          Non-Discrimination
        </p>
        <div className="social-icons">
          <img src={FBLogo} alt="Facebook Logo" />
          <img src={TwitterLogo} alt="Twitter Logo" />
          <img src={InstaLogo} alt="Instagram Logo" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
