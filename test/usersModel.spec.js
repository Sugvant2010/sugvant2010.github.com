var should = require('should');
var app = require('../app.js');
var request = require('supertest');
var shortId = require('shortid');

describe('Routing', function() {
    var url = 'http://5.196.200.247:3000/';


    describe('User', function() {

        it('should correctly login an existing account', function(done){
            var login = {
                username: 'admin',
                password: 'admin'
            };
            request(url)
                .post('/api/login')
                .send(login)
                .expect(200)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.id.should.equal('562f80cd82f23da873a9606e');
                    res.body.result.should.equal(true);
                    done();
                });
        });


        it('should get not auth session ', function(done){

            request(url)
                .get('/api/checkSession')
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.result.should.equal(false);
                    res.body.note.should.equal("Неавторизованная сессия");
                    done();
                });

        });

        it('should sign up a new user',function(done){
            var x = shortId.generate();
            var user = {
                username : x,
                email : x+"@test.com",
                password : "test"
            };
            request(url)
                .post('/api/users')
                .send(user)
                .expect(200)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('id');
                    res.body.result.should.equal(true);
                    done();
                });

        });

    });


    describe('Links', function(){

        it('should get links array ',function(){
            request(url)
                .get('/api/links')
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.links.should.be.instanceof(Array);
                    res.body.result.should.equal(true);
                    done();
                });
        });

        it('should get one link ',function(){
            var linkId = '562f826582f23da873a96070';
            request(url)
                .get('/api/links' + linkId)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.link.should.be.instanceof(Array);
                    res.body.result.should.equal(true);
                    done();
                });
        });

    });
});