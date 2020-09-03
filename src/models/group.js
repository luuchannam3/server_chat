import { Schema, model } from 'mongoose';


const GroupSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    id_user: { type: String },
    avatarGroup: { type: String },
    created: { type: String },
    description: { type: String },
    // admin: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
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
  },
);

export default model('Group', GroupSchema);
