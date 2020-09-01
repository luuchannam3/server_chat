import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    _id: {type: String},
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
    listUser: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    state: { type: String, required: true },
    rank: { type: String, default: -1 },
    discount: { type: String, default: 0 },
    coin: { type: String, default: 0 },
    province: { type: Object, ref: 'Province' },
    district: [{ type: Array, ref: 'District' }],
    avatar: { type: String, required: true },
    idmanager: { type: Schema.Types.ObjectId, ref: 'User' },
    isdelete: { type: Boolean, default: false },
    notifistate: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'User'
  }
);

export default model('User', UserSchema);
