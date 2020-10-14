import supertest from 'supertest'
import Group from '../models/group'
import Conversation from '../models/conversation'
var server = supertest.agent('http://localhost:5000')
const group = new Group({
    _id: "-poqmvndieuUndsnskd",
    id_user: "00000000000",
    avatarGroup: "test avatarGroup",
    description: "test upload avatarGroup description",
    members: [
        {
            id: "00000000000",
            avatar: "test avatar1",
            name: "test name1",
            token: "test token1"
        },
        {
            id: "00000000001",
            avatar: "test avatar2",
            name: "test name2",
            token: "test token2"
        }
    ],
    nameGroup: "test nameGroup",
    created: Date.now()
})
group.save((err) => {
    if (err) console.log(err)
})
const conversation = new Conversation({
    _id: "-poqmvndieuUndsnskd",
    lm: "test avatarGroup lm",
    url: "test avatarGroup url",
    type: 0,
    name: "test avatarGroup name",
    updateAt: Date.now(),
    listviewer: [],
    members: [
        "00000000000",
        "00000000001"
    ]
})
conversation.save((err) => {
    if (err) console.log(err)
})
describe('avatargroup', () => {
    it('POST', (done) => {
        server
            .post('/api/v1/avatargroup?conversation_id=-poqmvndieuUndsnskd')
            // .set('content-type', 'image/png')
            .attach('name', 'Group-icon.png', '../public/group')
            .expect(200)
            .end((err, res) => {
                done();
            });
    });
});