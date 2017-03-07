'use strict';

const expect = require('chai');
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'brian',
  password: 'awesome',
  email: 'exampleuser@test.com'
};
// MY CODE Pasting In Class code to see if issue is with this file.
// describe('Auth Routes!', function(){
//   describe('POST /api/signup', function(){
//     describe('with a valid body', function(){
//       after(done => {
//         User.remove({})
//         .then(() => done())
//         .catch(done);
//       });
//       it('should return a user', done => {
//         request.post(`${url}/api/signup`)
//         .send(exampleUser)
//         .end((err, res) => {
//           if(err) return done(err);
//           expect(res.status).to.equal(200);
//           expect(res.text).to.be.a('string');
//           done();
//         });
//       });
//     });
//     describe('with an invalid body', function(){
//       after(done => {
//         User.remove({})
//         .then(() => done())
//         .catch(done);
//       });
//       it('should return a 400', done => {
//         request.post(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(400);
//           done();
//         });
//       });
//     });
//   });
// });

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          console.log('\ntoken:', res.text, '\n');
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((err, res) => {
          if (err) return done(err);
          console.log('\nuser:', this.tempUser);
          console.log('\ntoken:', res.text);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});