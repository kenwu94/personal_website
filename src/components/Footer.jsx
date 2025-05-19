import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        <div className="social-links">
          <a href="https://github.com/kenwu94" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/kenwu05" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {/* Add more social links as needed */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;