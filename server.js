const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const chatRoutes = require('./api/chat');
const pdfService = require('./api/services/pdfService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize PDF service
async function initServices() {
  console.log('Loading PDFs...');
  const pdfs = await pdfService.loadPDFs();
  console.log(`Loaded ${pdfs.length} PDFs`);
}

initServices();

// Middleware
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// API routes
app.use('/api/chat', chatRoutes);

// For production, serve the React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});