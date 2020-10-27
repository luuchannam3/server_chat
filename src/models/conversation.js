import { Schema, model } from 'mongoose';

const ConversationSchema = new Schema({
  _id: { type: String },
  lm: { type: String },
  url: { type: String },
  type: { type: Number },
  name: { type: String },
  updateAt: { type: Date, default: Date.now },
  listviewer: { type: Array },
  members: { type: Array }
},
{
  collection: 'Conversation',
  versionKey: false
}
);

export default model('Conversation', ConversationSchema);
