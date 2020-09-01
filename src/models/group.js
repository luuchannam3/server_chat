import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
  _id: { type: String},
  avatarGroup: { type: String },
  created: { type: Date},
  description: {type: String},
  // admin: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User'
  // },
  member: [{
    id_object: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      id_user: {type: String}
    },    
  }],
  nameGroup: {type: String}
},
{
  collection: 'groups'
}
);

export default model('Group', GroupSchema);
