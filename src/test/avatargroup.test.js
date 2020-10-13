import fs from 'fs'
import supertest from 'supertest'
import path from 'path'
import should from 'should'
var server = supertest.agent('http://localhost:5000')
describe('avatargroup', () => {
    it('POST', (done) => {
        server
            .post('/api/v1/avatargroup?conversation_id=-qjBbcNFaIQVWRtR5qcy')
            // .set('content-type', 'image/png')
            .attach('name', 'Group-icon.png','../public/group')
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
});