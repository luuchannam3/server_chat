import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../app'

chai.should()
var group_id
chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(chaiHttp)
require("babel-core/register");
require("babel-polyfill");
describe('group', () => {
    it('POST: create group', (done) => {
        var test = {
            "avatarGroup": "test avatarGroup",
            "description": "test description",
            "members": [
                {
                    "avatar": "test avatar member",
                    "id": "CT00000001",
                    "name": "test name",
                    "token": "test token"
                },
                {
                    "avatar": "test avatar member 1",
                    "id": "CH00000001",
                    "name": "test name 1",
                    "token": "test token 1"
                }
            ],
            "nameGroup": "test nameGroup",
            "id_user": "CT00000001"
        }
        chai.request(server)
            .post('/api/v1/group?user_id=CT00000001')
            .type('form')
            .send(test)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                // console.log(res.body)
                res.body.should.have.property('group1');
                group_id=res.body.group1._id
                console.log(group_id)
                res.body.group1.should.have.property('_id');
                res.body.group1.should.have.property('id_user');
                res.body.group1.should.have.property('avatarGroup');
                res.body.group1.should.have.property('description');
                res.body.group1.should.have.property('members');
                for (let i = 0; i < res.body.group1.members.length; i++) {
                    res.body.group1.members[i].should.have.property('_id')
                    res.body.group1.members[i].should.have.property('avatar')
                    res.body.group1.members[i].should.have.property('id')
                    res.body.group1.members[i].should.have.property('name')
                    res.body.group1.members[i].should.have.property('token')
                }
                res.body.group1.should.have.property('nameGroup');
                res.body.group1.should.have.property('created');
                done();
            });
    });
    it('GET group', (done) => {
        chai.request(server)
            .get('/api/v1/group?group_id='+group_id)
            .end((err, res) => {
                res.should.have.status(200);
                console.log(group_id)
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('groups')
                for (let i = 0; i < res.body.groups.length; i++) {
                    res.body.groups[i].should.have.property('_id')
                    res.body.groups[i].should.have.property('id_user')
                    res.body.groups[i].should.have.property('avatarGroup')
                    res.body.groups[i].should.have.property('description')
                    res.body.groups[i].should.have.property('members')
                    res.body.groups[i].should.have.property('nameGroup')
                    res.body.groups[i].should.have.property('created')
                    for (let j = 0; j < res.body.groups[i].members.length; j++) {
                        res.body.groups[i].members[j].should.have.property('_id');
                        res.body.groups[i].members[j].should.have.property('avatar');
                        res.body.groups[i].members[j].should.have.property('id');
                        res.body.groups[i].members[j].should.have.property('name');
                        res.body.groups[i].members[j].should.have.property('token');
                    }
                }
                done();
            });
    });
    it('PUT: add user to group', (done) => {
        var test = {
            "avatar": "test add avatar",
            "id": "11110001388",
            "name": "test add member",
            "token": "test add token"
        }
        chai.request(server)
            .put('/api/v1/group?group_id='+group_id)
            .type('form')
            .send(test)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('avatar');
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('token');
                done();
            });
    });
    it('DEL: delete member in group', (done) => {
        chai.request(server)
            .delete('/api/v1/group?group_id='+group_id+'&user_id=CT00000001&member_id=11110001388')
            .end((err, res) => {
                console.log(group_id)
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
                res.body.should.have.property('member_id')
                res.body.should.have.property('group_id')
                done();
            });
    });

});