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
describe('conversation', () => {
    it('GET', (done) => {
        chai.request(server)
            .get('/api/v1/conversation?conversation_id=11110001035-11110001054&user_id=11110001035')
            //   .send({user_id:'11110001053'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('listConversation')
                for (let i = 0; i < res.body.listConversation.length; i++) {
                    res.body.listConversation[i].should.have.property('listviewer')
                    res.body.listConversation[i].should.have.property('members')
                    res.body.listConversation[i].should.have.property('_id')
                    res.body.listConversation[i].should.have.property('lm')
                    res.body.listConversation[i].should.have.property('type')
                    res.body.listConversation[i].should.have.property('name')
                    res.body.listConversation[i].should.have.property('updateAt')
                    res.body.listConversation[i].should.have.property('url')
                }
                done();
            });
    });
});