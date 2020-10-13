import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../app'
import fs from 'fs'
import supertest from 'supertest'

var should = chai.should()
chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(chaiHttp)
require("babel-core/register");
require("babel-polyfill");
describe('friend', () => {
    it('GET friend', (done) => {
        chai.request(server)
            .get('/api/v1/friend')
            .send({ user_id: '11110001053' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('friends')
                for (let i = 0; i < res.body.friends.length; i++) {
                    res.body.friends[i].should.have.property('_id')
                    res.body.friends[i].should.have.property('friend')
                    for (let j = 0; j < res.body.friends[i].length; j++) {
                        res.body.friends[i].friend[0].should.have.property('_id')
                        res.body.friends[i].friend[0].should.have.property('adress')
                        res.body.friends[i].friend[0].should.have.property('imageurl')
                        res.body.friends[i].friend[0].should.have.property('username')
                    }
                }
                done();
            });
    });
    it('POST: add friend', (done) => {
        var test = {
            "adress": "test address",
            "imageurl": "test image url",
            "username": "test username"
        }
        chai.request(server)
            .post('/api/v1/friend?user_id=11110001053&friend_id=11110000002')
            .type('form')
            .send(test)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                console.log(res.body)
                res.body.should.have.property('friend1')
                res.body.friend1.should.have.property('_id')
                res.body.friend1.should.have.property('adress')
                res.body.friend1.should.have.property('imageurl')
                res.body.friend1.should.have.property('username')
                done();
            });
    });
    it('DEL: delete friend', (done) => {
        chai.request(server)
            .delete('/api/v1/friend?user_id=11110001053&friend_id=11110000002')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('friend_id')
                done();
            });
    });
});