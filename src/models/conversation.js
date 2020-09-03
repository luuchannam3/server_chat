import { Schema, model } from 'mongoose';

const ConversationSchema = new Schema({
  _id: { type: String},
  lm: { type: String },
  url: { type: String},
  type: {type: Number},
  name: {type: String},
  updateAt: {type: Date, default: Date.now},
  members: {type: Array},
  isSeen: {type: Boolean, default: false}
},
{
  collection: 'Conversation',
  versionKey: false
}
);

export default model('Conversation', ConversationSchema);
