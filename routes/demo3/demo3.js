
const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/demo3', (req, res) => {
  const name = req.query.name || 'Guest';
  
  res.cookie('admin_session', 'admin123456789', { 
    httpOnly: false,
    secure: false
  });
  
  res.render('demo3/index', { 
    title: 'XSS Demo - Greeting Application',
    heading: `Hello, ${name}!`,
    name: name
  });
});

router.get('/demo3/docs', (req, res) => {
  res.render('demo3/docs', { title: 'XSS Demo Security Documentation' });
});

router.post('/demo3', (req, res) => {
  const name = req.body.name || 'Guest';
  
  res.cookie('admin_session', 'admin123456789', { 
    httpOnly: false,
    secure: false
  });
  
  res.render('demo3/index', { 
    title: 'XSS Demo - Greeting Application',
    heading: `Hello, ${name}!`,
    name: name
  });
});

module.exports = router;
