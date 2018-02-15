/* describe, it */

const chai = require('chai');
const chaiHTTP = require('chai-http');
const { app } = require('../src/server');

const should = chai.should();
chai.use(chaiHTTP);



// describe('/badges', () => {
//   it('Should return array of execise sessions logged by user', () => {
//     chai.request(app)
//       .get('/api/badges')
//       .then((res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//       });
//   });
// });

// it('Should return 200 status on GET requests', () => chai.request(app)
//   .get('/api/test')
//   .then((res) => {
//     res.should.have.status(200);
//     res.should.be.json;
//   }));
