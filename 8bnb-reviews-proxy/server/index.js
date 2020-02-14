const express = require('express');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
const request = require('request');
const app = express();
const port = 3000;

// Middleware
app.use(morgan('dev')); // for logging http requests to the terminal
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/', express.static(path.join(__dirname, '../public'))); // for serving static files


// Proxy requests to modules
const reservationModuleUrl = 'http://ec2-18-221-158-53.us-east-2.compute.amazonaws.com';
const reviewsModuleUrl = 'http://ec2-18-189-32-69.us-east-2.compute.amazonaws.com:3003'; // add routes
const calendarModuleUrl = 'http://ec2-54-153-109-129.us-west-1.compute.amazonaws.com:3000'; // add routes
const similarHomesModuleUrl = 'http://localhost:3004'; // change and add routes

// Forward requests for a space's info to reservations module
app.get('/spaces', function (req, res) {
  request(`${reservationModuleUrl}/spaces?id=${req.query.id}`, function (error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  });
});

// Forward requests for a list of reservations to reservations module
app.get('/reservations', function (req, res) {
  request(`${reservationModuleUrl}/reservations?spaceId=${req.query.spaceId}`, function (error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  });
});

// Forward requests to post a reservation to reservations module server (WIP)
app.post('/reservations', function (req, res) {
  request(`${reservationModuleUrl}/reservations`, function (error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  });
});

// Forward requests to get a list of homes to Will's similar homes module
app.get('/homes', function (req, res) {
  request(`${similarHomesModuleUrl}/homes`, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  })
});

// Forward requests to get a list of reviews to Jeremiah's reviews module
app.get('/reviews', function (req, res) {
  request(`${reviewsModuleUrl}/reviews`, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  })
});

// Forward requests to get a space's reservations to Vikas' calendar module
app.get('/data/:id', function (req, res) {
  request(`${reviewsModuleUrl}/data/${req.params.id}`, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log('statusCode:', response && response.statusCode);
      res.send(body);
    }
  })
});

app.listen(port, () => console.log(`Proxy server listening on port ${port}!`));