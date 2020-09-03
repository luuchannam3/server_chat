import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
  _id: { type: String},
  avatarGroup: { type: String },
  created: { type: Date},
  description: {type: String},
  member: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      avatar: {type: String},
      id: {type: String},
      name: {type: String},
      token: {type: String}
    },    
  ],
  nameGroup: {type: String}
},
{
  collection: 'groups'
}
);

export default model('Group', GroupSchema);
