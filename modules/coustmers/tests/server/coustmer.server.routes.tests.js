'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Coustmer = mongoose.model('Coustmer'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, coustmer;

/**
 * Coustmer routes tests
 */
describe('Coustmer CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Coustmer
    user.save(function () {
      coustmer = {
        name: 'Coustmer name'
      };

      done();
    });
  });

  it('should be able to save a Coustmer if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coustmer
        agent.post('/api/coustmers')
          .send(coustmer)
          .expect(200)
          .end(function (coustmerSaveErr, coustmerSaveRes) {
            // Handle Coustmer save error
            if (coustmerSaveErr) {
              return done(coustmerSaveErr);
            }

            // Get a list of Coustmers
            agent.get('/api/coustmers')
              .end(function (coustmersGetErr, coustmersGetRes) {
                // Handle Coustmer save error
                if (coustmersGetErr) {
                  return done(coustmersGetErr);
                }

                // Get Coustmers list
                var coustmers = coustmersGetRes.body;

                // Set assertions
                (coustmers[0].user._id).should.equal(userId);
                (coustmers[0].name).should.match('Coustmer name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Coustmer if not logged in', function (done) {
    agent.post('/api/coustmers')
      .send(coustmer)
      .expect(403)
      .end(function (coustmerSaveErr, coustmerSaveRes) {
        // Call the assertion callback
        done(coustmerSaveErr);
      });
  });

  it('should not be able to save an Coustmer if no name is provided', function (done) {
    // Invalidate name field
    coustmer.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coustmer
        agent.post('/api/coustmers')
          .send(coustmer)
          .expect(400)
          .end(function (coustmerSaveErr, coustmerSaveRes) {
            // Set message assertion
            (coustmerSaveRes.body.message).should.match('Please fill Coustmer name');

            // Handle Coustmer save error
            done(coustmerSaveErr);
          });
      });
  });

  it('should be able to update an Coustmer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coustmer
        agent.post('/api/coustmers')
          .send(coustmer)
          .expect(200)
          .end(function (coustmerSaveErr, coustmerSaveRes) {
            // Handle Coustmer save error
            if (coustmerSaveErr) {
              return done(coustmerSaveErr);
            }

            // Update Coustmer name
            coustmer.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Coustmer
            agent.put('/api/coustmers/' + coustmerSaveRes.body._id)
              .send(coustmer)
              .expect(200)
              .end(function (coustmerUpdateErr, coustmerUpdateRes) {
                // Handle Coustmer update error
                if (coustmerUpdateErr) {
                  return done(coustmerUpdateErr);
                }

                // Set assertions
                (coustmerUpdateRes.body._id).should.equal(coustmerSaveRes.body._id);
                (coustmerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Coustmers if not signed in', function (done) {
    // Create new Coustmer model instance
    var coustmerObj = new Coustmer(coustmer);

    // Save the coustmer
    coustmerObj.save(function () {
      // Request Coustmers
      request(app).get('/api/coustmers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Coustmer if not signed in', function (done) {
    // Create new Coustmer model instance
    var coustmerObj = new Coustmer(coustmer);

    // Save the Coustmer
    coustmerObj.save(function () {
      request(app).get('/api/coustmers/' + coustmerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', coustmer.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Coustmer with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/coustmers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Coustmer is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Coustmer which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Coustmer
    request(app).get('/api/coustmers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Coustmer with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Coustmer if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coustmer
        agent.post('/api/coustmers')
          .send(coustmer)
          .expect(200)
          .end(function (coustmerSaveErr, coustmerSaveRes) {
            // Handle Coustmer save error
            if (coustmerSaveErr) {
              return done(coustmerSaveErr);
            }

            // Delete an existing Coustmer
            agent.delete('/api/coustmers/' + coustmerSaveRes.body._id)
              .send(coustmer)
              .expect(200)
              .end(function (coustmerDeleteErr, coustmerDeleteRes) {
                // Handle coustmer error error
                if (coustmerDeleteErr) {
                  return done(coustmerDeleteErr);
                }

                // Set assertions
                (coustmerDeleteRes.body._id).should.equal(coustmerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Coustmer if not signed in', function (done) {
    // Set Coustmer user
    coustmer.user = user;

    // Create new Coustmer model instance
    var coustmerObj = new Coustmer(coustmer);

    // Save the Coustmer
    coustmerObj.save(function () {
      // Try deleting Coustmer
      request(app).delete('/api/coustmers/' + coustmerObj._id)
        .expect(403)
        .end(function (coustmerDeleteErr, coustmerDeleteRes) {
          // Set message assertion
          (coustmerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Coustmer error error
          done(coustmerDeleteErr);
        });

    });
  });

  it('should be able to get a single Coustmer that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Coustmer
          agent.post('/api/coustmers')
            .send(coustmer)
            .expect(200)
            .end(function (coustmerSaveErr, coustmerSaveRes) {
              // Handle Coustmer save error
              if (coustmerSaveErr) {
                return done(coustmerSaveErr);
              }

              // Set assertions on new Coustmer
              (coustmerSaveRes.body.name).should.equal(coustmer.name);
              should.exist(coustmerSaveRes.body.user);
              should.equal(coustmerSaveRes.body.user._id, orphanId);

              // force the Coustmer to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Coustmer
                    agent.get('/api/coustmers/' + coustmerSaveRes.body._id)
                      .expect(200)
                      .end(function (coustmerInfoErr, coustmerInfoRes) {
                        // Handle Coustmer error
                        if (coustmerInfoErr) {
                          return done(coustmerInfoErr);
                        }

                        // Set assertions
                        (coustmerInfoRes.body._id).should.equal(coustmerSaveRes.body._id);
                        (coustmerInfoRes.body.name).should.equal(coustmer.name);
                        should.equal(coustmerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Coustmer.remove().exec(done);
    });
  });
});
