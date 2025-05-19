import React from 'react';

function Header() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Prevent any ongoing animations
      window.cancelAnimationFrame(window.scrollAnimation);
      
      // Get the element's position relative to the viewport
      const rect = element.getBoundingClientRect();
      
      // Get the scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate the absolute position of the element
      const offsetPosition = rect.top + scrollTop;
      
      // Scroll smoothly to the section
      window.scrollTo({
        top: offsetPosition - 80, // Adjust for header height
        behavior: 'smooth'
      });
      
      // Update URL without causing page reload
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Ken Wu
          </a>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#chat" 
                onClick={(e) => { e.preventDefault(); scrollToSection('chat'); }}
              >
                Chat
              </a>
            </li>
            {/* Add more menu items as needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;