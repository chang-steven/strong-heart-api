const faker = require('faker');
const mongoose = require('mongoose');

const { User } = require('../src/models/user');
const { Exercise } = require('../src/models/exercise');

function generateUserData() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function generateExerciseData() {
  return {
    date: faker.date.past(),
    activity: faker.random.word(),
    duration: faker.random.number(),
  };
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndPostExercises(i) {
  console.log(`Creating User ${i + 1}`);
  const testUser = {
    email: faker.internet.email(),
    password: null,
  };
  return User.hashPassword(faker.internet.password())
    .then((password) => {
      testUser.password = password;
      return User.create(testUser);
    })
    .then((user) => {
      const userId = user._id;
      let j = 0;
      const exercisePromises = [];
      while (j < 2) {
        console.log(`Generating exercise ${j + 1} for user`);
        const newExercise = generateExerciseData();
        newExercise.userId = userId;
        exercisePromises.push(Exercise.create(newExercise));
        j++;
      }
      console.log('Generated Exercise');
      console.log('==================');
      return Promise.all(exercisePromises);
    })
    .catch((err) => {
      console.error(err);
    });
}

function seedHeartStrongDatabase() {
  let i = 0;
  const promises = [];
  while (i < 2) {
    promises.push(createTestUserAndPostExercises(i));
    i++;
  }
  console.log('Generated iteration of user data');
  console.log('.....................');
  return Promise.all(promises);
}

function teardownDatabase() {
  console.warn('Deleting database...');
  return mongoose.connection.dropDatabase();
}

module.exports = {
  seedHeartStrongDatabase,
  generateUserData,
  generateExerciseData,
  createTestUser,
  teardownDatabase,
};
