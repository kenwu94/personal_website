import React, { useEffect, useLayoutEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Chat from './components/Chat';
import Footer from './components/Footer';
import SectionScroll from './utils/SectionScroll';

function App() {
  // Handle hash navigation only after ensuring we start at the top
  useEffect(() => {
    // Set a small timeout to ensure we start at the top first
    setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // If no matching element, ensure we're at the top
          window.scrollTo(0, 0);
        }
      }
    }, 100);
    
    // Remove focus from any elements that might cause scrolling
    document.activeElement.blur();
    
    // Make sure elements aren't auto-focused
    const preventAutoFocus = (e) => {
      e.preventDefault();
    };
    
    
  }, []);

  return (
    <div className="App">
      <Header />
      <SectionScroll />
      <main>
        <Hero />
        <About />
        <Chat />
        {/* Additional sections will be added later */}
      </main>
      <Footer />
    </div>
  );
}

export default App;