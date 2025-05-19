import { useEffect } from 'react';

export default function SectionScroll() {
  // Force scroll to top on initial load
  useEffect(() => {
    // Disable browser scroll restoration - use window.history instead of history
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately on component mount
    window.scrollTo(0, 0);
    
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollCooldown = 1000; // Time in ms to wait before allowing another scroll action
    
    // Get all sections
    const sections = Array.from(document.querySelectorAll('section'));
    
    const handleScroll = (event) => {
      // Prevent handling if already scrolling or within cooldown period
      const now = Date.now();
      if (isScrolling || now - lastScrollTime < scrollCooldown) {
        event.preventDefault();
        return;
      }
      
      // Determine scroll direction
      const direction = event.deltaY > 0 ? 1 : -1;
      
      // Find the section currently in view
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const headerHeight = 80; // Adjust based on your header height
      
      // Find the active section (the one most visible in the viewport)
      let activeIndex = -1;
      let maxVisibleArea = 0;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          activeIndex = index;
        }
      });
      
      // Determine target section index
      let targetIndex = activeIndex + direction;
      
      // Ensure target index is within valid range
      if (targetIndex >= 0 && targetIndex < sections.length) {
        // Set flag to prevent multiple scrolls
        isScrolling = true;
        lastScrollTime = now;
        
        // Get target section
        const targetSection = sections[targetIndex];
        
        // Scroll to target section
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Also update URL hash for bookmarking
        window.history.pushState(null, '', `#${targetSection.id}`);
        
        // Reset flag when animation completes
        setTimeout(() => {
          isScrolling = false;
        }, 1000); // Match this with your scroll animation duration
        
        // Prevent default scroll behavior
        event.preventDefault();
      }
    };
    
    // Add wheel event listener with passive: false to allow preventDefault()
    window.addEventListener('wheel', handleScroll, { passive: false });

    let touchStartY = 0;
    let touchEndY = 0;
    const touchThreshold = 50; // Minimum swipe distance

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
      // Prevent handling if already scrolling or within cooldown period
      const now = Date.now();
      if (isScrolling || now - lastScrollTime < scrollCooldown) {
        return;
      }
      
      touchEndY = event.changedTouches[0].clientY;
      
      // Calculate swipe distance
      const swipeDistance = touchStartY - touchEndY;
      
      // Only process if above threshold
      if (Math.abs(swipeDistance) < touchThreshold) return;
      
      // Determine direction (positive = down, negative = up)
      const direction = swipeDistance > 0 ? 1 : -1;
      
      // Use the same section finding logic as in handleScroll
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const headerHeight = 80;
      
      let activeIndex = -1;
      let maxVisibleArea = 0;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          activeIndex = index;
        }
      });
      
      let targetIndex = activeIndex + direction;
      
      if (targetIndex >= 0 && targetIndex < sections.length) {
        isScrolling = true;
        lastScrollTime = now;
        
        const targetSection = sections[targetIndex];
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        window.history.pushState(null, '', `#${targetSection.id}`);
        
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    // Add touch event listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  return null;
}