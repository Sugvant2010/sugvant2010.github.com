var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
//home





//Authentication
router.get('/users/my', helpers.auth);
router.put('/users/my', helpers.auth);
router.post('/links', helpers.auth);
router.put('/links/:id', helpers.auth);
router.delete('/links/:id', helpers.auth);

//Authorization
router.get('/checkSession', require('./users').checkSession);
router.post('/login', require('./users').login);
router.get('/logout', require('./users').logout);
router.post('/forgot', require('./users').forgot);
router.post('/reset/:token', require('./users').reset);

//users
router.get('/users/my', require('./users').one);
router.post('/users', require('./users').signUp);
router.put('/users/my', require('./users').update);

//links
router.get('/links/my', require('./links').my);
router.get('/links/:id', require('./links').one);
router.post('/links', require('./links').create);
router.put('/links/:id', require('./links').update);
router.delete('/links/:id', require('./links').delete);
router.get('/links', require('./links').list);
router.get('/s/:tags', require('./links').tags);


module.exports = router;
