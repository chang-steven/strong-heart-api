const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app} = require('../src/server');

const should = chai.should();
chai.use(chaiHTTP);

describe('API', function() {
  it('Should return 200 status on GET requests', function() {
    return chai.request(app)
    .get('/api/test')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
    })
  })
})
