require('dotenv').config();

const { expect } = require('chai');
const http = require('http');
const nock = require('nock');

const { app, initApp } = require('../../../server');
const request = require('supertest');

// A route specific fixture must be created and injected for each respective test specification
const fixtures = require('../../fixture/test.json');

// A common fixture that can be used for all the test specifications
const commonFixture = require('../../fixture/common.json');

describe('POST /action', () => {
  let app;
  before(() => {
    sinon.stub(middleware, 'validateAccessToken').callsFake((req, res, next) => {
      if (res.headers.authorization === 'Bearer ###') {
        return next();
      }
      res.statusCode(403);
      return res.end();
    });

    app = require('../../../server').default;
  });

  before(() => {
    return new Promise(((resolve, reject) => {
      initApp().then((err, res) => {
        if (err) reject(err);
        return resolve();
      });
    }));
  });


  describe('actions resource features', () => {  
    describe('POST /actions', () => {
      it('should return an error if access token is invalid', (done) => {
        request(app)
        .post('/api/actions')
        .send(fixtures.createAction.payload.valid)
        .set('Authorization', `Bearer ${commonFixture.auth.inValidAccessToken}`)
        .end((err, res) => {
          if (err) done(err);
    
          expect(res.statusCode).to.be.equal(405);
          done();
        });
      });
    
      it('should return an error if request payload is invalid', (done) => {
        request(app)
        .post('/api/actions')
        .send(fixtures.createAction.payload.invalid)
        .set('Authorization', 'Bearer ###')
        .end((err, res) => {
          if (err) done(err);
    
          expect(res.statusCode).to.be.equal(400);
          done();
        });
      });
    
      it('should return an error if mandatory key(s) is/are missing in the request payload', (done) => {
        request(app)
        .post('/api/actions')
        .send(fixtures.createAction.payload.missing)
        .set('Authorization', 'Bearer ###')
        .end((err, res) => {
          if (err) done(err);
    
          expect(res.statusCode).to.be.equal(400);
          done();
        });
      });
    
      it('should create an action record for valid payload', (done) => {
        request(app)
        .post('/api/actions')
        .send(fixtures.createAction.payload.valid)
        .set('Authorization', 'Bearer ###')
        .end((err, res) => {
          if (err) done(err);
    
          expect(res.statusCode).to.be.equal(200);
          done();
        });
      });
    });

    /**
     * external-service-host = any external serivce where our app is consuming it. For e.g. https://api.github.com
     * { resonse: "{{external-service-response-read}}" } = the actual payload that external service endpoint expects
     */
    describe('GET /action', () => {
      // sample assertion with nock + sinon, post + get
      it('should retrun an action record for valid payload', (done) => {
        nock('http://{{external-service-host}}')
          .post('/actions', { payload: "{{read-the-blog-from-fixture}}" })
          .reply(200, { resonse: "{{external-service-response-read}}" })
          .post('/actions/count', '*')
          .reply(200, { response: "{{external-service-response-read}}" });
        request(app)
          .get('/api/actions')
          .set('Authorization', 'Bearer ###')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
      
            // For validation checks can be added.
            // expect(res.body).to.be.equal(fixtures.create.response.success);
            done();
        });
      });
    });
  });
});