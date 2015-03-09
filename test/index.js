// Load modules

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Wreck = require('wreck');


// Declare internals

var internals = {};
internals.Wreck = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

lab.beforeEach(function (done) {

  // Cache real implementation of Wreck methods
  internals.Wreck.get = Wreck.get;
  internals.Wreck.post = Wreck.post;

  done();
});

lab.afterEach(function (done) {

  // Reset Wreck methods
  Wreck.get = internals.Wreck.get;
  Wreck.post = internals.Wreck.post;

  done();
});

it('returns an error when request for cert fails', function (done) {

  var server = new Hapi.Server();
  server.connection();
  server.register(require('../'), function (err) {
    expect(err).to.not.exist();

    Wreck.get('https://www.googleapis.com/oauth2/v1/certs', function (err, response, payload) {

      var payloadObject = JSON.parse(payload);
      var firstKey = Object.keys(payloadObject)[0];

      // Replace get with mock
      Wreck.get = function (url, callback) {
        callback(new Error('Bad stuff happened'), { response: { statusCode: 500 }});
      };

      server.methods.auth.google.getCertificate(firstKey, function (err, cert) {
        expect(err).to.exist();
        done();
      });
    });
  });
});

it('returns an error when requested cert is not available', function (done) {

  var server = new Hapi.Server();
  server.connection();
  server.register(require('../'), function (err) {
    expect(err).to.not.exist();

    Wreck.get('https://www.googleapis.com/oauth2/v1/certs', function (err, response, payload) {

      server.methods.auth.google.getCertificate('invalidCertId', function (err, cert) {
        expect(err).to.exist();
        done();
      });
    });
  });
});

it('returns a certificate', function (done) {

  var server = new Hapi.Server();
  server.connection();
  server.register(require('../'), function (err) {
    expect(err).to.not.exist();

    Wreck.get('https://www.googleapis.com/oauth2/v1/certs', function (err, response, payload) {

      var payloadObject = JSON.parse(payload);
      var firstKey = Object.keys(payloadObject)[0];

      server.methods.auth.google.getCertificate(firstKey, function (err, cert) {
        expect(err).to.not.exist();
        expect(cert).to.equal(payloadObject[firstKey]);
        done();
      });
    });
  });
});
