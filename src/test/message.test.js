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
            .get('/api/v1/getMessage?conversation_id=11110001035-11110001054&id_sender=11110001054')
            //   .send({user_id:'11110001053'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('listMessage')
                for (let i = 0; i < res.body.listMessage.length; i++) {
                    res.body.listMessage[i].should.have.property('isImage');
                    res.body.listMessage[i].should.have.property('_id');
                    res.body.listMessage[i].should.have.property('id_Conversation');
                    res.body.listMessage[i].should.have.property('Content');
                    res.body.listMessage[i].should.have.property('isSender');
                    res.body.listMessage[i].should.have.property('time');
                }
                done();
            });
    });
});