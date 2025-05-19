import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToSection() {
  const { hash } = useLocation();

  useEffect(() => {
    // If there is a hash in the URL (e.g., /#about)
    if (hash) {
      // Remove the # character
      const sectionId = hash.substring(1);
      
      // Find the element with the corresponding ID
      const element = document.getElementById(sectionId);
      
      // If the element exists, scroll to it smoothly
      if (element) {
        // Add a small delay to ensure any rendering is complete
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [hash]); // Re-run when the hash changes

  return null;
}