# HEARTSTRONG API  [![Build Status](https://travis-ci.org/chang-steven/strong-heart-api.svg?branch=master)](https://travis-ci.org/chang-steven/strong-heart-api)

### introduction:
HEARTSTRONG is a personal exercise tracker, helping you log exercise sessions ensuring you reap the benefits of cardiovascular fitness.  Regular exercise is difficult, but HEARTSTRONG provides visual analysis about minutes exercised per session and displays data about the types of activities performed using Chart.js, helping you keep on track.  You can dynamically add new types of activities and exercise sessions, and see a lifetime log of all previous exercise.

### technologies: 
/ <a href="https://nodejs.org/">Node.js</a> / <a href="https://expressjs.com/">Express</a> / <a href="http://mongoosejs.com/">Mongoose</a> / <a href="https://docs.mongodb.com/">MongoDB</a> / <a href="http://www.passportjs.org/">Passport</a> / bcryptjs / <a href="https://mochajs.org/">Mocha</a> + <a href="http://chaijs.com/">Chai</a> (testing) / <a href="https://travis-ci.org/">Travis CI</a> / <a href="https://www.heroku.com/">Heroku</a> /

The HEARTSTRONG API is an Express application using Nodejs 
<ul>
  <li>Implements RESTful architecture style</li>
  <li>Mongoose for object modeling for the MongoDB database.</li>
  <li>Passwords are encrypted with bcryptjs</li>
  <li>JWT authentiction is session-based and does not persist</li>
  <li>API endpoints are tested with Mocha, Chai, Faker</li>
</ul>



### live site:
https://heartstrong.netlify.com/

### front end client repository:
https://github.com/chang-steven/strong-heart-client

### landing page:
<img src="/public/landing-page.jpeg" width="500" alt="landing page">
