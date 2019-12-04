import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    roles: { type: Number, required: true },
    listUser: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    state: { type: Boolean, required: true },
    rank: { type: Number, default: -1 },
    discount: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    province: { type: String, ref: 'province' },
    district: [{ type: String, ref: 'district' }],
    avatar: { type: String, required: true },
    idmanager: { type: Schema.Types.ObjectId, ref: 'user' },
    isdelete: { type: Boolean, default: false },
    notifistate: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export default model('user', UserSchema);
