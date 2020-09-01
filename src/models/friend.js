import { Schema, model } from 'mongoose';

const FriendSchema = new Schema({
  id_user: { type: String},
  username: { type: String },
  imageurl: { type: String},
  friend: {type: Array},
  address: {type: String}
},
{
  collection: 'Friend'
}
);

export default model('Friend', FriendSchema);
