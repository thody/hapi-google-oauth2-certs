[![Build Status](https://img.shields.io/travis/thody/hapi-google-oauth2-certs.svg)](https://travis-ci.org/thody/hapi-google-oauth2-certs)
[![npm version](https://img.shields.io/npm/v/hapi-google-oauth2-certs.svg)](https://www.npmjs.com/package/hapi-google-oauth2-certs)

# Introduction

Registers a Hapi [server method](http://hapijs.com/tutorials/server-methods) to retrieve Google oAuth2 certificates for 
[validation of ID tokens](https://developers.google.com/accounts/docs/OpenIDConnect#validatinganidtoken). Since 
certificates do not change regularly, they are cached using Hapi's native cache for 24 hours to eliminate unnecessary
network calls.

# Usage

## Register this plugin:

```
server.register({ register: require('hapi-google-oauth2-certs') }, function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});
```

## Retrieve a certificate: 

```
server.methods.auth.google.getCertificate('someCertificateId', function (err, certificate) {
    if (err) {
        // Handle error
    }
    
    // Use certificate
});
```
