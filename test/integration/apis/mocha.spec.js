require('dotenv').config();

const { expect } = require('chai');
const http = require('http');

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
    // write the meaningful possible assertion
    it('should return an error if access token is invalid', (done) => {
      request(app)
      .post('/api/actions')
      .send(fixtures.create.payload.valid)
      .set('Authorization', `Bearer ${commonFixture.auth.inValidAccessToken}`)
      .end((err, res) => {
        if (err) done(err);
  
        expect(res.statusCode).to.be.equal(405);
        done();
      });
    });
  
    // write the meaningful possible assertion
    it('should return an error if request payload is invalid', (done) => {
      request(app)
      .post('/api/actions')
      .send(fixtures.create.payload.invalid)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) done(err);
  
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });
  
    // write the meaningful possible assertion
    it('should return an error if mandatory key(s) is/are missing in the request payload', (done) => {
      request(app)
      .post('/api/actions')
      .send(fixtures.create.payload.missing)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) done(err);
  
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });
  
    // write the meaningful possible assertion
    it('should create an action record for valid payload', (done) => {
      request(app)
      .post('/api/actions')
      .send(fixtures.create.payload.valid)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) done(err);
  
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  })
  
});