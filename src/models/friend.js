import { Schema, model } from 'mongoose';

const FriendSchema = new Schema({
  _id: { type: String },
  idNew: { type: String },
  friend: [
    {
      _id: { type: String },
      id_friend: { type: String },
      adress: { type: String },
      imageurl: { type: String },
      username: { type: String }
    }
  ]
},
{
  collection: 'Friend',
  versionKey: false
}
);

export default model('Friend', FriendSchema);
