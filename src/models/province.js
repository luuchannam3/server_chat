import { Schema, model } from 'mongoose';

const ProvinceSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  domain: { type: String, required: true },
});

export default model('province', ProvinceSchema);
