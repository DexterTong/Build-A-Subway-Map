/* eslint-env mocha*/
/* eslint no-unused-expressions: ["off"] */

const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/app.js');

const should = chai.should();
chai.use(chaiHttp);

describe('Home', () => {
  it('Should display a home page', (done) => {
    chai.request(server)
      .get('/').end((err, res) => {
        if (err) { return done(err); }

        res.should.have.status(200);
        res.should.be.html;
        res.should.have.headers;
        return done();
      });
  });
});
