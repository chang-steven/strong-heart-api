// Data parser that processes and returns usable data to the client to display

const dataParser = (exerciseLogArray) => {
  exerciseLogArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalExerciseSessions = exerciseLogArray.length;
  let totalExerciseMinutes = 0;
  const activitiesCount = {};

  exerciseLogArray.forEach((exercise) => {
    totalExerciseMinutes += exercise.duration;
    if (!(exercise.activity in activitiesCount)) {
      activitiesCount[exercise.activity] = 1;
    }
    else {
      activitiesCount[exercise.activity] += 1;
    }
  });

  const activitiesArray = [];
  const activities = Object.keys(activitiesCount);
  const count = Object.values(activitiesCount);
  for (let i = 0; i < activities.length; i++) {
    const myObj = {};
    myObj.activity = activities[i];
    myObj.count = count[i];
    activitiesArray.push(myObj);
  }
  activitiesArray.sort();
  const exerciseStatistics = {
    totalExerciseSessions,
    totalExerciseMinutes,
    averageMinutesPerSession: (totalExerciseMinutes / totalExerciseSessions).toFixed(1),
    activitiesArray,
    activities,
    count,
  };
  const responseObject = {
    exerciseLog: exerciseLogArray,
    exerciseStatistics,
  };
  return responseObject;
};


module.exports = { dataParser };
