/* eslint-env mocha*/
/* eslint no-unused-expressions: ["off"] */

const path = require('path');
const chai = require('chai');
const chaiHTTP = require('chai-http');

const app = path.join('..', 'server', 'app.js');
const should = chai.should();

chai.use(chaiHTTP);

describe('Home', () => {
  it('Should display a home page', (done) => {
    chai.request('http://localhost:3000')
      .get('/').end((err, res) => {
        if (err) { return done(err); }

        res.should.have.status(200);
        res.should.be.html;
        return done();
      });
  });
});
