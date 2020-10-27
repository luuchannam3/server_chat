import { Schema, model } from 'mongoose';

const GroupSchema = new Schema(
  {
    _id: { type: String},
    id_user: { type: String },
    avatarGroup: { type: String },
    description: { type: String },
    members: [
      {
        id: {
          type: String,
        },
        avatar: {
          type: String,
        },
        name: { type: String },
        token: { type: String },
      },
    ],
    nameGroup: { type: String },
    created: { type: Date, default: Date.now }
  },
  {
    collection: 'Group',
    versionKey: false
  },
);

export default model('Group', GroupSchema);
