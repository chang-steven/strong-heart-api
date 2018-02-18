/* describe, it, before, beforeEach, afterEach, after */

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../src/models/user');

const {
  seedHeartStrongDatabase,
  teardownDatabase
} = require('./test-functions');

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config/main');


describe('User Router to /api/user', () => {
  let testUser;
  let testUserData;

  before(() => runServer(TEST_DATABASE_URL));

  beforeEach((done) => {
    testUserData = {
      email: faker.internet.email(),
      unhashedPassword: faker.internet.password(),
    };
    User.hashPassword(testUserData.unhashedPassword)
      .then((password) => {
        testUserData.password = password;
        return User.create(testUserData)
      })
      .then((user) => {
        testUser = user;
        seedHeartStrongDatabase()
          .then(() => done());
      })
      .catch(err => console.log(err));
  });

  afterEach(() => teardownDatabase());

  after(() => closeServer());

  describe('POST request to /signup', () => {
    it('Should create a new user in the database', () => {
      const newUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      return chai.request(app)
        .post('/api/signup')
        .send(newUser)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('message');
        });
    });

    it('Should throw an error', () => {
      const newUser = {
        email: faker.internet.email()
      };
      return chai.request(app)
        .post('/api/signup')
        .send(newUser)
        .catch((err) => {
          err.should.have.status(422);
        });
    });
  });

  describe('POST request to /user', () => {
    it('Should login a registered user', () => {
      const loginUser = {
        email: testUserData.email,
        password: testUserData.unhashedPassword
      }
      return chai.request(app)
        .post('/api/user')
        .send(loginUser)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('message', 'currentUser', 'activities', 'exerciseLog', 'exerciseStatistics', 'authToken');
        });
    });
  });

  describe('GET request to /user', () => {
    it('Should get user info if token', () => {
      const token = jwt.sign({ _id: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      return chai.request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('currentUser', 'activities', 'exerciseLog', 'exerciseStatistics');
        });
    });
  });

  describe('POST request to /activity', () => {
    it('Should create a new activity for a specified user', () => {
      const activity = { activity: 'new-activity' };
      const token = jwt.sign({ _id: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      return chai.request(app)
        .post('/api/activity')
        .set('Authorization', `Bearer ${token}`)
        .send(activity)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('activities');
          res.body.activities[0].should.equal(activity.activity);
        });
    });
  });
});
