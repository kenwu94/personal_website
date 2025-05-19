import React, { useRef, useEffect } from 'react';

function ParticleBackground({ containerId }) {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Handle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas to full section size
    const resizeCanvas = () => {
      const container = document.getElementById(containerId);
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Re-initialize particles when canvas is resized
        initParticles();
      }
    };
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      const container = document.getElementById(containerId);
      if (container) {
        const rect = container.getBoundingClientRect();
        mousePosition.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }
    };
    
    // Create particles
    const initParticles = () => {
      particles = [];
      const particleCount = 60;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          hue: Math.random() * 60 + 170, // Blue to purple hues
          opacity: Math.random() * 0.5 + 0.1,
          lastPositions: [], // Array to store previous positions for trails
          trailTimestamps: [] // Array to store timestamps for each position
        });
      }
    };
    
    // Animation function
    const animate = () => {
      // Clear canvas with solid background for complete refresh
      ctx.fillStyle = 'rgba(15, 15, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const now = Date.now();
      
      // Draw and update particles
      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Check boundaries with wrap-around but prevent trail lines across screen
        let wrapped = false;
        if (particle.x < 0) { particle.x = canvas.width; wrapped = true; }
        if (particle.x > canvas.width) { particle.x = 0; wrapped = true; }
        if (particle.y < 0) { particle.y = canvas.height; wrapped = true; }
        if (particle.y > canvas.height) { particle.y = 0; wrapped = true; }
        
        // Only store position for trail if particle didn't wrap around
        if (!wrapped) {
          // Store current position for trail with timestamp
          particle.lastPositions.push({ x: particle.x, y: particle.y, hue: particle.hue });
          particle.trailTimestamps.push(now);
        } else {
          // Clear trail history when wrapping to prevent lines across screen
          particle.lastPositions = [];
          particle.trailTimestamps = [];
        }
        
        // Determine trail max age in milliseconds (2 seconds - shortened for faster fading)
        const trailMaxAge = 2000;
        
        // Remove positions older than max age
        while (particle.trailTimestamps.length > 0 && now - particle.trailTimestamps[0] > trailMaxAge) {
          particle.lastPositions.shift();
          particle.trailTimestamps.shift();
        }
        
        // Draw trails with fading opacity based on age
        if (particle.lastPositions.length > 1) {
          for (let i = 0; i < particle.lastPositions.length - 1; i++) {
            const pos = particle.lastPositions[i];
            const nextPos = particle.lastPositions[i + 1];
            const posAge = now - particle.trailTimestamps[i];
            
            // Calculate distance between points to prevent long lines
            const distance = Math.sqrt(
              Math.pow(nextPos.x - pos.x, 2) + 
              Math.pow(nextPos.y - pos.y, 2)
            );
            
            // Skip drawing this segment if distance is too large
            if (distance > 50) continue;
            
            // Calculate opacity based on age (newer = more opaque)
            const ageRatio = 1 - (posAge / trailMaxAge);
            const trailOpacity = ageRatio * particle.opacity * 0.6; // Reduce max opacity for trails
            
            if (trailOpacity > 0) {
              ctx.strokeStyle = `hsla(${pos.hue}, 100%, 70%, ${trailOpacity})`;
              ctx.lineWidth = particle.size * 0.5 * ageRatio; // Make older sections thinner
              ctx.beginPath();
              ctx.moveTo(pos.x, pos.y);
              ctx.lineTo(nextPos.x, nextPos.y);
              ctx.stroke();
            }
          }
        }
        
        // Draw current particle
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Change direction near mouse
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.speedX = particle.speedX + (dx * 0.01);
          particle.speedY = particle.speedY + (dy * 0.01);
          
          // Create dynamic color changes based on mouse interaction
          particle.hue = (particle.hue + 0.5) % 360;
        }
        
        // Limit speed
        const maxSpeed = 1;
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed;
          particle.speedY = (particle.speedY / speed) * maxSpeed;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.getElementById(containerId).addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.getElementById(containerId)?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerId]);

  return <canvas ref={canvasRef} className="background-canvas"></canvas>;
}

export default ParticleBackground;