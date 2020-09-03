import { Schema, model } from 'mongoose';

const FriendSchema = new Schema({
  _id: { type: String},
  friend: [
    {
      _id: {type: String},
      adress: {type: String},
      imageurl: {type: String},
      username: {type: String}
    },
  ]
},
{
  collection: 'Friend'
}
);

export default model('Friend', FriendSchema);
