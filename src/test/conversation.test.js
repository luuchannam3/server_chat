/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../app';
import { ResetDB, SetUpDB } from './config';

const agent = supertest(app);

describe('Conversation API', () => {
  let uid;
  let cid;
  before(async () => {
    await ResetDB();
    const res = await SetUpDB();
    uid = res.uid;
    cid = res.cid;
  });

  after(async () => {
    await ResetDB();
  });

  it('invalid params', async () => {
    const res = await agent.get('/api/v1/conversation');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.eql('Invalid params');
  });

  it('not found conversation', async () => {
    const res = await agent.get('/api/v1/conversation?uid=uid');
    expect(res.body).to.have.property('cons');
    expect(res.body.cons.length).to.eql(0);
  });

  it('get conversation of user_01', async () => {
    const res = await agent.get(`/api/v1/conversation?uid=${uid}`);
    expect(res.body).to.have.property('cons');
    expect(res.body.cons.length).to.eql(1);
    expect(res.body.cons[0]._id).to.eql(cid);
  });
});
