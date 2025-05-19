import React, { useEffect, useRef } from 'react';
// Import social media icons
import linkedinIcon from '../assets/images/linkedin.png';
import githubIcon from '../assets/images/github.png';
import instagramIcon from '../assets/images/instagram.png';
import discordIcon from '../assets/images/discord.png';
import spotifyIcon from '../assets/images/spotify.png';

function About() {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas to full section size
    const resizeCanvas = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        canvas.width = aboutSection.offsetWidth;
        canvas.height = aboutSection.offsetHeight;
        
        // Re-initialize particles when canvas is resized
        initParticles();
      }
    };
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      const aboutSection = document.getElementById('about');
      const rect = aboutSection.getBoundingClientRect();
      mousePosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };
    
    // Create particles
    const initParticles = () => {
      particles = [];
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(0, 119, 255, ${Math.random() * 0.5 + 0.1})`
        });
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach((particle, index) => {
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Check boundaries
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Connect particles that are close to mouse
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Draw line to mouse
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 119, 255, ${0.3 - distance/500})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
          ctx.stroke();
          
          // Slightly attract particles towards mouse
          particle.x += dx * 0.01;
          particle.y += dy * 0.01;
        }
        
        // Connect nearby particles with lines
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 119, 255, ${0.2 - distance/500})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.getElementById('about').addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.getElementById('about').removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="about" className="about">
      <canvas 
        ref={canvasRef} 
        className="background-canvas"
      />
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Hello!
            </p>
            <p>
              PLACEHOLDER TEXT
            </p>
            <div className="social-icons">
              <h3>Connect With Me</h3>
              <div className="icon-grid">
                <a href="https://linkedin.com/in/kenwu05" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <div className="icon linkedin-icon">
                    <img src={linkedinIcon} alt="" className="social-icon-img" />
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/kenwu94" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                  <div className="icon github-icon">
                    <img src={githubIcon} alt="" className="social-icon-img" />
                  </div>
                  <span>GitHub</span>
                </a>
                <a href="https://instagram.com/ken.wu94" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                  <div className="icon instagram-icon">
                    <img src={instagramIcon} alt="" className="social-icon-img" />
                  </div>
                  <span>Instagram</span>
                </a>
                <div className="social-icon discord-icon-container" aria-label="Discord">
                  <div className="icon discord-icon">
                    <img src={discordIcon} alt="" className="social-icon-img" />
                  </div>
                  <span className="discord-username">Discord</span>
                  <span className="discord-tooltip">@kenzw</span>
                </div>
                <a href="https://open.spotify.com/user/klst4rq6xer4tq33fxkvrsfwb?si=3fb4dffc96644606" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Spotify">
                  <div className="icon spotify-icon">
                    <img src={spotifyIcon} alt="" className="social-icon-img" />
                  </div>
                  <span>Spotify</span>
                </a>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src={require("../assets/images/pfp.jpg")} alt="Profile picture" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;