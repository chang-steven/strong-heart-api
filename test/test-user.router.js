/* describe, it, before, beforeEach, afterEach, after */

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');

const { User } = require('../src/models/user');
const { Exercise } = require('../src/models/exercise');

const {
  seedHeartStrongDatabase,
  generateUserData,
  generateExerciseData,
  createTestUser,
  teardownDatabase
} = require('./test-functions');

const { app, runServer, closeServer } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config/main');


describe('User Router to /api/user', () => {
  let testUser;
  let testUserData;

  before(() => runServer(TEST_DATABASE_URL));

  beforeEach((done) => {
    testUserData = generateUserData();
    User.create(testUserData)
      .then((user) => {
        testUser = user;
        seedHeartStrongDatabase()
          .then(() => done());
      })
      .catch(err => console.log(err));
  });

  afterEach(() => teardownDatabase());

  after(() => closeServer());

  describe('POST request to /user', () => {
    it('Should create a new user in the database', () => {
      const newUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      return chai.request(app)
        .post('/api/signup')
        .send(newUser)
        .then((res) => {
          console.log(res.body);
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
          // console.log(err, err.res);
          err.should.have.status(422);
          // err.should.be.json;
          // err.body.should.include.keys('code', 'reason', 'message', 'location');
        });
    });
  });
});
