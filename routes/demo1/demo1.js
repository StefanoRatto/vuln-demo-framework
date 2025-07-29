
const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const users = {};
const savedSearches = {};
const appointments = {};
const sentEmails = []; // Store sent emails for preview
const cars = [
  { id: 1, make: 'Volkswagen', model: 'Golf', year: 2019, price: 18500, zipCode: '02201' },
  { id: 2, make: 'Honda', model: 'Civic', year: 2020, price: 22000, zipCode: '02201' },
  { id: 3, make: 'Toyota', model: 'Camry', year: 2021, price: 28000, zipCode: '44333' },
  { id: 4, make: 'Ford', model: 'Focus', year: 2018, price: 16000, zipCode: 'nationwide' },
  { id: 5, make: 'BMW', model: '328i', year: 2019, price: 32000, zipCode: '90210' }
];

function generateUserId() {
  return uuidv4();
}

function generateUser(userId = null) {
  const id = userId || generateUserId();
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
  const firstName = names[Math.floor(Math.random() * names.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  users[id] = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    zipCode: ['02201', '44333', '90210', '10001'][Math.floor(Math.random() * 4)],
    ownedCars: [
      { make: cars[Math.floor(Math.random() * cars.length)].make, model: 'Owned Model', year: 2015 + Math.floor(Math.random() * 8) }
    ]
  };
  return users[id];
}

for (let i = 0; i < 20; i++) {
  generateUser();
}

router.get('/demo1', (req, res) => {
  res.render('demo1/index', { title: 'AutoFinder - Car Search Platform' });
});

router.get('/demo1/docs', (req, res) => {
  res.render('demo1/docs', { title: 'AutoFinder Security Documentation' });
});

router.get('/demo1/appt-dos-attack', (req, res) => {
  res.render('demo1/dos-attack', { title: 'AutoFinder - Appointment DOS Attack Demo' });
});

// Endpoint to get valid user IDs for DOS attack demonstration
router.get('/demo1/api/demo-user-ids', (req, res) => {
  // Get first 8 user IDs for the DOS attack demonstration
  const userIds = Object.keys(users).slice(0, 8);
  res.json({
    userIds: userIds,
    count: userIds.length,
    message: 'Valid user IDs for DOS attack demonstration'
  });
});

router.post('/demo1/search', (req, res) => {
  const { make, minPrice, maxPrice, zipCode, distance, saveName } = req.body;
  let userId = req.body.userId || generateUserId();
  
  if (!users[userId]) {
    generateUser(userId);
  }
  
  const results = cars.filter(car => {
    const makeMatch = !make || car.make.toLowerCase().includes(make.toLowerCase());
    const priceMatch = (!minPrice || car.price >= parseInt(minPrice)) && 
                      (!maxPrice || car.price <= parseInt(maxPrice));
    const locationMatch = !zipCode || car.zipCode === zipCode || car.zipCode === 'nationwide';
    return makeMatch && priceMatch && locationMatch;
  });
  
  res.json({
    userId: userId,
    results: results
  });
});

router.get('/demo1/api/saved-searches/:searchId', (req, res) => {
  const searchId = parseInt(req.params.searchId);
  const search = savedSearches[searchId];
  
  console.log(`Looking for search ID: ${searchId}`);
  console.log(`Available searches: ${Object.keys(savedSearches)}`);
  console.log(`Search found:`, search);
  
  if (!search) {
    return res.status(404).json({ error: 'Search not found' });
  }
  
  res.json({
    id: search.id,
    userId: search.userId,
    name: search.name,
    searchCriteria: search.searchCriteria
  });
});

router.post('/demo1/api/saved-searches', (req, res) => {
  const { userId, name, searchCriteria } = req.body;
  
  if (!users[userId]) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  const searchId = Math.floor(Math.random() * 9000000) + 1000000; // Generate 7-digit number
  savedSearches[searchId] = {
    id: searchId,
    userId: userId,
    name: name,
    searchCriteria: searchCriteria,
    dateSaved: new Date().toISOString().split('T')[0],
    sendNotifications: true
  };
  
  console.log(`Saved search with ID: ${searchId}`);
  console.log(`Total saved searches: ${Object.keys(savedSearches).length}`);
  
  // HTML injection vulnerability - search name inserted directly without encoding
  const emailContent = `
    <div style="background: #1e3a5f; color: white; padding: 40px; font-family: Arial, sans-serif; text-align: center;">
      <h1 style="color: white; font-size: 36px; margin-bottom: 20px;">You've got matches!</h1>
      <p style="font-size: 18px; margin-bottom: 30px;">We've found multiple vehicles that match your ${name || 'search'} search.</p>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin-bottom: 15px;">Search criteria: ${JSON.stringify(searchCriteria)}</p>
        <p><a href="http://localhost:3000/demo1" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Results</a></p>
      </div>
    </div>
  `;
  
  // Store email for preview and simulate sending
  const emailData = {
    id: sentEmails.length + 1,
    to: users[userId].email,
    toName: `${users[userId].firstName} ${users[userId].lastName}`,
    from: 'noreply@autofinder.com',
    fromName: 'AutoFinder Notifications',
    subject: 'AutoFinder - New matches for your search!',
    htmlContent: emailContent,
    timestamp: new Date().toISOString(),
    searchName: name,
    searchId: searchId
  };
  
  sentEmails.push(emailData);
  
  console.log(`\n=== EMAIL SENT TO ${users[userId].email} ===`);
  console.log('Subject: AutoFinder - New matches for your search!');
  console.log('HTML Body:');
  console.log(emailContent);
  console.log(`=== Email stored with ID: ${emailData.id} ===\n`);
  
  res.status(201).json({
    result: 'Success',
    searchId: searchId,
    emailSent: true
  });
});

router.post('/api/appointments/legacy/:dealerId', (req, res) => {
  const { appointmentTime, appointmentDate, phoneNumber, originPageId, userId, skipEmailConfirmation } = req.body;
  const dealerId = req.params.dealerId;
  
  if (!users[userId]) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  const appointmentKey = `${userId}-${dealerId}-${appointmentDate}`;
  
  if (appointments[appointmentKey]) {
    return res.status(409).json({ error: 'User already has appointment at this dealership on this date' });
  }
  
  appointments[appointmentKey] = {
    userId: userId,
    dealerId: dealerId,
    appointmentTime: appointmentTime,
    appointmentDate: appointmentDate,
    phoneNumber: phoneNumber,
    originPageId: originPageId,
    skipEmailConfirmation: skipEmailConfirmation
  };
  
  res.json({
    result: 'Success'
  });
});

// Function to check if a car matches search criteria
function carMatchesSearch(car, searchCriteria) {
  const makeMatch = !searchCriteria.make || car.make.toLowerCase().includes(searchCriteria.make.toLowerCase());
  const priceMatch = (!searchCriteria.minPrice || car.price >= parseInt(searchCriteria.minPrice)) && 
                    (!searchCriteria.maxPrice || car.price <= parseInt(searchCriteria.maxPrice));
  const locationMatch = !searchCriteria.zipCode || car.zipCode === searchCriteria.zipCode || car.zipCode === 'nationwide';
  return makeMatch && priceMatch && locationMatch;
}

// Function to send notification emails for matching searches
function sendNotificationEmails(newCar) {
  console.log(`\n=== CHECKING SAVED SEARCHES FOR NEW CAR: ${newCar.year} ${newCar.make} ${newCar.model} ===`);
  
  Object.values(savedSearches).forEach(search => {
    if (search.sendNotifications && carMatchesSearch(newCar, search.searchCriteria)) {
      const user = users[search.userId];
      if (user) {
        // HTML injection vulnerability - search name inserted directly without encoding
        const emailContent = `
          <div style="background: #1e3a5f; color: white; padding: 40px; font-family: Arial, sans-serif; text-align: center;">
            <h1 style="color: white; font-size: 36px; margin-bottom: 20px;">You've got matches!</h1>
            <p style="font-size: 18px; margin-bottom: 30px;">We've found a new vehicle that matches your ${search.name || 'search'} search.</p>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: white; margin-bottom: 15px;">${newCar.year} ${newCar.make} ${newCar.model}</h3>
              <p style="margin-bottom: 10px;"><strong>Price:</strong> $${newCar.price.toLocaleString()}</p>
              <p style="margin-bottom: 10px;"><strong>Location:</strong> ${newCar.zipCode}</p>
              <p style="margin-bottom: 20px;"><strong>Your search:</strong> ${search.name || 'Unnamed search'}</p>
              <p><a href="http://localhost:3000/demo1" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Results</a></p>
            </div>
          </div>
        `;
        
        // Store email for preview
        const emailData = {
          id: sentEmails.length + 1,
          to: user.email,
          toName: `${user.firstName} ${user.lastName}`,
          from: 'noreply@autofinder.com',
          fromName: 'AutoFinder Notifications',
          subject: 'AutoFinder - New match found!',
          htmlContent: emailContent,
          timestamp: new Date().toISOString(),
          searchName: search.name,
          searchId: search.id,
          triggerCar: `${newCar.year} ${newCar.make} ${newCar.model}`
        };
        
        sentEmails.push(emailData);
        
        console.log(`\n=== EMAIL SENT TO ${user.email} ===`);
        console.log('Subject: AutoFinder - New match found!');
        console.log('HTML Body:');
        console.log(emailContent);
        console.log(`=== Email stored with ID: ${emailData.id} ===\n`);
      }
    }
  });
}

// Admin endpoint to add new cars (simulates new inventory)
router.post('/demo1/admin/add-car', (req, res) => {
  const { make, model, year, price, zipCode } = req.body;
  
  if (!make || !model || !year || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newCar = {
    id: cars.length + 1,
    make: make,
    model: model,
    year: parseInt(year),
    price: parseInt(price),
    zipCode: zipCode || 'nationwide'
  };
  
  cars.push(newCar);
  
  // Send notification emails to users with matching saved searches
  sendNotificationEmails(newCar);
  
  res.json({
    result: 'Success',
    car: newCar,
    message: 'Car added and notification emails sent to matching searches'
  });
});

router.get('/demo1/saved-cars/:userId', (req, res) => {
  const userId = req.params.userId;
  
  console.log(`Looking for saved searches for user: ${userId}`);
  
  // Find all saved searches for this user (IDOR vulnerability - no authorization check)
  const userSavedSearches = Object.values(savedSearches).filter(search => search.userId === userId);
  
  console.log(`Found ${userSavedSearches.length} saved searches for user ${userId}`);
  
  if (!users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    userId: userId,
    firstName: users[userId].firstName,
    lastName: users[userId].lastName,
    email: users[userId].email,
    savedSearches: userSavedSearches.map(search => ({
      id: search.id,
      name: search.name,
      searchCriteria: search.searchCriteria,
      dateSaved: search.dateSaved
    }))
  });
});

router.get('/sell-my-car/api/customer/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    claimId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    zipCode: user.zipCode,
    ownedCars: user.ownedCars
  });
});

// Demo endpoint to trigger email notifications (simulates new cars being posted)
router.post('/demo1/trigger-notifications', (req, res) => {
  console.log('\n=== SIMULATING NEW CAR POSTINGS ===');
  
  // Simulate some new affordable cars being posted (triggers searches with low price limits)
  const demoNewCars = [
    { id: 999, make: 'Honda', model: 'Civic', year: 2020, price: 15000, zipCode: '44333' },
    { id: 998, make: 'Toyota', model: 'Corolla', year: 2019, price: 12000, zipCode: '90210' },
    { id: 997, make: 'Ford', model: 'Focus', year: 2021, price: 18000, zipCode: 'nationwide' }
  ];
  
  let emailsSent = 0;
  demoNewCars.forEach(car => {
    console.log(`\nProcessing new car: ${car.year} ${car.make} ${car.model} - $${car.price}`);
    Object.values(savedSearches).forEach(search => {
      if (search.sendNotifications && carMatchesSearch(car, search.searchCriteria)) {
        emailsSent++;
      }
    });
    sendNotificationEmails(car);
  });
  
  res.json({
    result: 'Success',
    message: `Processed ${demoNewCars.length} new cars, sent ${emailsSent} notification emails`,
    newCars: demoNewCars
  });
});

// Gmail-style email preview routes
router.get('/demo1/emails', (req, res) => {
  res.render('demo1/emails', { 
    title: 'AutoFinder Email Preview - Inbox',
    emails: sentEmails 
  });
});

router.get('/demo1/emails/:id', (req, res) => {
  const emailId = parseInt(req.params.id);
  const email = sentEmails.find(e => e.id === emailId);
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }
  
  res.render('demo1/email-view', { 
    title: 'AutoFinder Email Preview',
    email: email 
  });
});

// User Details Enumeration Vulnerability - IDOR to get any user's personal information
// Route matches the PDF documentation: /sell-my-car/api/customer/{userID}
router.get('/sell-my-car/api/customer/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Customer not found',
      message: 'No customer found with the provided ID'
    });
  }
  
  // VULNERABILITY: Return complete user details without authorization check
  // This allows anyone with a user ID to access personal information
  res.json({
    claimId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    zipCode: user.zipCode,
    ownedCars: user.ownedCars,
    // Additional vulnerable data exposure
    fullProfile: {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      contactInfo: {
        primaryEmail: user.email,
        phoneNumber: user.phone,
        mailingAddress: {
          zipCode: user.zipCode,
          region: user.zipCode === '02201' ? 'Boston, MA' :
                  user.zipCode === '44333' ? 'Cleveland, OH' :
                  user.zipCode === '90210' ? 'Beverly Hills, CA' :
                  user.zipCode === '10001' ? 'New York, NY' : 'Unknown'
        }
      },
      vehicles: user.ownedCars,
      accountCreated: '2023-01-15T10:30:00Z', // Mock data
      lastLogin: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        smsAlerts: true,
        marketingOptIn: Math.random() > 0.5
      }
    }
  });
});

module.exports = router;
