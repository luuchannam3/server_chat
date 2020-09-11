import { Schema, model } from 'mongoose';


const GroupSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    id_user: { type: String },
    avatarGroup: { type: String },
    created: { type: Date ,default: Date.now},
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
  },
  {
    collection: 'Group',
    versionKey: false
  },
);

export default model('Group', GroupSchema);
