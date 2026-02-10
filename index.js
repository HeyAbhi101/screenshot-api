const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Screenshot API is running!',
    version: '1.0.0',
    endpoints: {
      capture: '/api/screenshot'
    }
  });
});

// Main screenshot endpoint
app.get('/api/screenshot', async (req, res) => {
  try {
    const { url, width, height, fullpage } = req.query;

    // Validation
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    // Set defaults
    const viewport_width = width || '1920';
    const viewport_height = height || '1080';
    const full_page = fullpage === 'true' ? 'true' : 'false';

    // Using a free screenshot service
    // This will return a simple screenshot URL
    const screenshotUrl = `https://image.thum.io/get/width/${viewport_width}/crop/${viewport_height}/${encodeURIComponent(url)}`;

    res.json({
      success: true,
      screenshot_url: screenshotUrl,
      settings: {
        url: url,
        width: viewport_width,
        height: viewport_height,
        fullpage: full_page
      },
      message: 'Screenshot generated successfully'
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to capture screenshot',
      details: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Screenshot API running on port ${PORT}`);
});

module.exports = app;