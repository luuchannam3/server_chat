import { Schema, model } from 'mongoose';

const ConversationSchema = new Schema({
  _id: { type: String},
  lm: { type: String },
  url: { type: String},
  type: {type: Number},
  name: {type: String},
  updateAt: {type: Date},
  members: {type: Array}
},
{
  collection: 'Conversation'
}
);

export default model('Conversation', ConversationSchema);
