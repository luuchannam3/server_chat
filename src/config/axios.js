import axios from 'axios';
import config from './main';

export const instance = axios.create({
  baseURL: config.CMS.HOST,
});

export const GetUserData = async (token) => {
  const res = await instance.get('/api/Socket', {
    headers: {
      'x-key': config.CMS.KEY,
      'x-token': token,
    },
  });

  return res.data;
};
