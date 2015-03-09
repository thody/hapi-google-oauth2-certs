// Load modules
var Hoek = require('hoek');
var Wreck = require('wreck');


// Declare internals
var internals = {};


exports.register = function (server, options, next) {

  var methodOptions = {
    cache: {
      expiresIn: 1000 * 60 * 60 * 24 // keep for 24 hours
    }
  };

  server.method('auth.google.getCertificate', internals.implementation, methodOptions);
  next();

};


exports.register.attributes = {
  pkg: require('../package.json')
};


internals.implementation = function (certificateId, callback) {

  Hoek.assert(certificateId, 'Missing certificate ID');

  Wreck.get('https://www.googleapis.com/oauth2/v1/certs', function (err, response, payload) {

      if (err && response.statusCode !== 200) {

        callback(err, null);

      } else {

        var certs = JSON.parse(payload);

        if (Hoek.contain(certs, certificateId)) {

          callback(null, certs[certificateId]);

        } else {

          callback(new Error('Could not find certificate with that ID'), null);

        }
      }
    }
  );
};
