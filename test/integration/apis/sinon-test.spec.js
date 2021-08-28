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

let accessToken = null;

// Describe the meaningful name as per your feature
describe('actions resource features', () => {

  before(() => {
    return new Promise(((resolve, reject) => {
      initApp().then((err, res) => {
        if (err) reject(err);
        return resolve();
      });
    }));
  });

  // User this if we don't want to mock the middelware auth behaviour. Refer scenario #3 test spec sample
  describe('POST /auth', () => {
    // write the meaningful assertion
    it('should return user details', (done) => {
      request(app)
      .post('/api/auth')
      .send({sendUserCreds})
      .end((err, res) => {
        if (err) done(err);
  
        accessToken = res.body.payload.userRoles[0].userInfo.accessToken;
        expect(res.statusCode).to.be.equal(201);
        expect(res.body.success).to.be.equal(true);
        done();
      });
    });
  });

  describe('POST /actions', () => {
    afterEach(() => {
      nock.enableNetConnect();
      nock.cleanAll();
    });

    // write the meaningful possible assertion
    it('should return an error if access token is invalid', (done) => {
      request(app)
      .get('/api/actions')
      .set('Authorization', `Bearer ${commonFixture.auth.inValidAccessToken}`)
      .end((err, res) => {
        if (err) done(err);
  
        expect(res.statusCode).to.be.equal(405);
        done();
      });
    });

    // Use "nock" to mock the 3rd party service api
    // "nock" helps to make sequential requests
    // must know the 3rd party api's response.
    // keep the response in a separate file -> read -> compare the response for validation
    it('should retrun an action record for valid payload', (done) => {
      nock('http://{{external-service-host}}')
      .post('/actions', '*')
      .reply(200, { resonse: "{{external-service-response-read}}" })
      .post('/actions/count', '*')
      .reply(200, { response: "{{external-service-response-read}}" });
      request(app)
      .post('/api/actions')
      .send(fixtures.create.payload.valid)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
  
        expect(res.body).to.be.equal(fixtures.create.response.success);
        done();
      });
    });
  })
  
});