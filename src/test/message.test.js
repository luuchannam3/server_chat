/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../app';
import { ResetDB, SetUpDB } from './config';

const agent = supertest(app);

describe('Message API', () => {
  let cid;
  let mid;
  before(async () => {
    await ResetDB();
    const res = await SetUpDB();
    cid = res.cid;
    mid = res.mid;
  });

  after(async () => {
    await ResetDB();
  });

  it('invalid params', async () => {
    const res = await agent.get('/api/v1/message');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.eql('Invalid params');
  });

  it('get message by cid', async () => {
    const res = await agent.get(`/api/v1/message?cid=${cid}`);
    expect(res.body).to.have.property('messages');
    expect(res.body.messages.length).to.eql(1);
    expect(res.body.messages[0]._id).to.eql(mid);
  });
});
