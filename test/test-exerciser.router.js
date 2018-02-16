
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = require('chai').should();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../src/models/user');
const { Exercise } = require('../src/models/exercise');

const {
  seedHeartStrongDatabase,
  generateUserData,
  generateExerciseData,
  createTestUser,
  teardownDatabase
} = require('./test-functions');


chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../src/server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../src/config/main');


describe('Exercise Router to /api/exercise', () => {
  let testUser;
  let testUserData;

  before(() => runServer(TEST_DATABASE_URL));

  beforeEach((done) => {
    testUserData = generateUserData();
    console.log(testUserData);
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

  describe('POST request to /exercise', () => {
    it('Should create a new exercise session for logged in user', () => {
      const token = jwt.sign({ _id: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      const exercise = generateExerciseData();
      return chai.request(app)
        .post('/api/exercise')
        .set('Authorization', `Bearer ${token}`)
        .send(exercise)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('exerciseLog', 'exerciseStatistics');
        });
    });
  });

  describe('PUT request to /exercise', () => {
    it('Should update an existing exercise for a user', () => {
      const token = jwt.sign({ _id: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      const updatedExercise = generateExerciseData();
      return Exercise.findOne()
        .then((result) => {
          updatedExercise._id = result._id;
          return chai.request(app)
            .put('/api/exercise')
            .set('Authorization', `Bearer ${token}`)
            .send(updatedExercise)
            .then((res) => {
              console.log(res);
              res.should.have.status(200);
              res.should.be.json;
              return Exercise.findById(updatedExercise._id);
            })
            .then((res) => {
              res.duration.should.equal(updatedExercise.duration);
              res.activity.should.equal(updatedExercise.activity);
            });
        });
    });
  });

  describe('DELETE request to /exercise', () => {
    it('Should update an existing exercise for a user', () => {
      const token = jwt.sign({ _id: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      const deleteId = {};
      return Exercise.findOne()
        .then((result) => {
          deleteId.id = result._id;
          return chai.request(app)
            .delete('/api/exercise')
            .set('Authorization', `Bearer ${token}`)
            .send(deleteId)
            .then((res) => {
              res.should.have.status(200);
              return Exercise.findById(deleteId._id);
            })
            .then((exercise) => {
              console.log(exercise);
              should.not.exist(exercise);
            });
        });
    });
  });




});
