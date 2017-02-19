/* eslint-env node,mocha */
/* eslint no-unused-expressions: ["off"] */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/app.js');

const should = chai.should(); // eslint-disable-line no-unused-vars
chai.use(chaiHttp);

describe('Routes', () => {
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

    it('Responds with a 404 page for nonexistent resources', (done) => {
      chai.request(server).get('/foo/bar/baz').end((err, res) => {
        if (!err) { return done(new Error(`The response was not an error. Status code ${res.status}`)); }

        res.should.have.status(404);
        res.should.have.headers;
        res.should.be.html;
        return done();
      });
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

  describe('Server-side Saves', () => {
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
});
