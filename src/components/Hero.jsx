import React, { useEffect, useRef, useState } from 'react';

function Hero() {
  const canvasRef = useRef(null);
  // State for quote with separate text and author parts
  const [quote, setQuote] = useState({ text: "", author: "" });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    
    // Fetch quotes from public folder
    const fetchRandomQuote = async () => {
      try {
        console.log("Fetching quotes from public folder...");
        
        // Fetch quotes.json from the public folder
        const response = await fetch('/quotes.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch quotes: ${response.status}`);
        }
        
        // Parse the JSON response
        const quotes = await response.json();
        console.log(`Loaded ${quotes.length} quotes from JSON`);
        
        if (quotes.length > 0) {
          // Select a random quote
          const randomIndex = Math.floor(Math.random() * quotes.length);
          const randomQuote = quotes[randomIndex];
          console.log(`Selected random quote (index ${randomIndex} of ${quotes.length}):`, randomQuote);
          
          // Set the quote
          setQuote({
            text: randomQuote.text,
            author: randomQuote.author
          });
        } else {
          throw new Error("No quotes found in JSON file");
        }
      } catch (error) {
        console.error("Error loading quotes:", error);
        // Fallback quote
        setQuote({
          text: "You must do the things you think you cannot do.",
          author: "Eleanor Roosevelt"
        });
      }
    };
    
    // Set canvas to full section size
    const resizeCanvas = () => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
      }
    };
    
    // Animation function
    const animate = () => {
      // Clear canvas with a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 12, 32, 0.8)');
      gradient.addColorStop(1, 'rgba(15, 20, 50, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Wave parameters
      const waveCount = 3;
      const waves = [];
      
      // Create different wave configurations
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          amplitude: 25 + i * 20, 
          wavelength: 200 + i * 100,
          speed: 0.03 - i * 0.01,
          verticalOffset: canvas.height * (0.3 + i * 0.2),
          color: `rgba(0, 119, 255, ${0.07 - i * 0.02})`,
          thickness: 4 + i * 2
        });
      }
      
      // Draw each wave
      waves.forEach(wave => {
        drawWave(wave, time);
      });
      
      // Update time
      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Function to draw a single wave
    const drawWave = (waveConfig, time) => {
      const { amplitude, wavelength, speed, verticalOffset, color, thickness } = waveConfig;
      
      ctx.beginPath();
      ctx.moveTo(0, verticalOffset);
      
      // Generate smooth wave path
      for (let x = 0; x < canvas.width; x += 5) {
        // Use multiple sine waves with different frequencies for complexity
        const y = verticalOffset + 
                  amplitude * Math.sin((x / wavelength) + time * speed * 5) +
                  amplitude * 0.5 * Math.sin((x / (wavelength * 0.6)) + time * speed * 3) +
                  amplitude * 0.3 * Math.sin((x / (wavelength * 0.3)) + time * speed * 7);
        
        ctx.lineTo(x, y);
      }
      
      // Complete the wave path
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      // Fill wave
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add subtle glow effect
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = thickness - i;
        ctx.strokeStyle = color.replace(')', `, ${0.1 - i * 0.02})`);
        ctx.shadowColor = 'rgba(0, 119, 255, 0.5)';
        ctx.shadowBlur = 20;
        
        // Draw just the top of the wave
        ctx.moveTo(0, verticalOffset);
        for (let x = 0; x < canvas.width; x += 5) {
          const y = verticalOffset + 
                    amplitude * Math.sin((x / wavelength) + time * speed * 5) +
                    amplitude * 0.5 * Math.sin((x / (wavelength * 0.6)) + time * speed * 3) +
                    amplitude * 0.3 * Math.sin((x / (wavelength * 0.3)) + time * speed * 7);
          
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
    };
    
    // Add some floating geometric shapes
    const drawShapes = (time) => {
      const shapes = 12;
      
      for (let i = 0; i < shapes; i++) {
        const x = (canvas.width / shapes) * i + (Math.sin(time * 0.5 + i) * 50);
        const y = canvas.height * 0.4 + Math.sin(time * 0.3 + i * 0.7) * (canvas.height * 0.2);
        const size = 15 + Math.sin(time * 0.2 + i) * 5;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.1 + i * (Math.PI / 6));
        
        // Alternating shapes
        if (i % 3 === 0) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.866, size * 0.5);
          ctx.lineTo(-size * 0.866, size * 0.5);
          ctx.closePath();
          
          ctx.fillStyle = `rgba(0, 119, 255, ${0.1 + Math.sin(time + i) * 0.05})`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(time + i) * 0.05})`;
          ctx.stroke();
        } else if (i % 3 === 1) {
          // Square
          ctx.beginPath();
          ctx.rect(-size/2, -size/2, size, size);
          
          ctx.fillStyle = `rgba(0, 119, 255, ${0.08 + Math.sin(time + i) * 0.04})`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.sin(time + i) * 0.04})`;
          ctx.stroke();
        } else {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          
          ctx.fillStyle = `rgba(0, 119, 255, ${0.12 + Math.sin(time + i) * 0.06})`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + Math.sin(time + i) * 0.06})`;
          ctx.stroke();
        }
        
        ctx.restore();
      }
    };
    
    // Enhanced animation that includes waves and shapes
    const enhancedAnimate = () => {
      // Clear canvas with a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 12, 32, 0.97)');
      gradient.addColorStop(0.7, 'rgba(15, 20, 50, 0.97)');
      gradient.addColorStop(1, 'rgba(20, 30, 70, 0.97)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw floating shapes
      drawShapes(time);
      
      // Wave parameters
      const waveCount = 3;
      const waves = [];
      
      // Create different wave configurations
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          amplitude: 25 + i * 20, 
          wavelength: 200 + i * 100,
          speed: 0.3 - i * 0.01,
          verticalOffset: canvas.height * (0.5 + i * 0.15),
          color: `rgba(0, 119, 255, ${0.1 - i * 0.03})`,
          thickness: 4 + i * 2
        });
      }
      
      // Draw each wave
      waves.forEach(wave => {
        drawWave(wave, time);
      });
      
      // Update time
      time += 0.01;
      animationFrameId = requestAnimationFrame(enhancedAnimate);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Load random quote
    fetchRandomQuote();
    
    // Start animation
    enhancedAnimate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <section id="home" className="hero">
      <canvas 
        ref={canvasRef} 
        className="background-canvas"
      />
      <div className="container">
        <h1>Hello, I'm <span className="highlight">Ken Wu</span></h1>
        <h2>Software and AI Agent Developer</h2>
        {quote.text && (
          <p className="hero-quote">"{quote.text}" - <i>{quote.author}</i></p>
        )}
        <div className="cta">
          <a href="#about" className="btn btn-primary">Learn More</a>
          <a 
            href="resume2.pdf" // Path to your resume
            className="btn btn-secondary" // You can style this differently
            download="Ken_Wu_Resume.pdf" // Suggested filename
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;