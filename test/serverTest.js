/* eslint-env mocha*/
/* eslint no-unused-expressions: ["off"] */

const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/app.js');

const should = chai.should();
chai.use(chaiHttp);

function shouldBeFileType(done, type, err, res) {
  if (err) { return done(err); }

  res.should.have.status(200);
  res.should.have.headers;
  res.should.be[type];
  return done();
}

describe('Pages', () => {
  it('Home page is accessible', (done) => {
    chai.request(server).get('/').end(shouldBeFileType.bind(null, done, 'html'));
  });

  it('Map (web app) page is accessible', (done) => {
    chai.request(server).get('/map').end(shouldBeFileType.bind(null, done, 'html'));
  });
});

describe('Scripts', () => {
  const scripts = ['cityMap.js', 'core.js', 'files.js', 'line.js', 'station.js', 'ui.js', 'utils.js'];
  for (let i = 0; i < scripts.length; i++) {
    it(`Client-side script "${scripts[i]}" is accessible`, (done) => {
      chai.request(server).get(`/scripts/${scripts[i]}`).end(shouldBeFileType.bind(null, done, 'js'));
    });
  }
});

describe('CSS', () => {
  const css = ['base.css', 'map.css'];
  for (let i = 0; i < css.length; i++) {
    it(`Stylesheet "${css[i]}" is accessible`, (done) => {
      chai.request(server).get(`/stylesheets/${css[i]}`).end(shouldBeFileType.bind(null, done, 'css'));
    });
  }
});

describe('Saves', () => {
  const saves = ['nyc2017.json'];
  for (let i = 0; i < saves.length; i++) {
    it(`Save file "${saves[i]}" is accessible`, (done) => {
      chai.request(server).get(`/data/${saves[i]}`).end(shouldBeFileType.bind(null, done, 'json'));
    });
  }
});

describe('Other Resources', () => {
  it('Favicon is accessible', (done) => {
    chai.request(server).get('/favicon.ico').end(shouldBeFileType.bind(null, done, 'image'));
  });
});
