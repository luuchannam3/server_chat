import { Schema, model } from 'mongoose';

const DistrictSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  provinceID: { type: String, ref: 'province' },
});

export default model('district', DistrictSchema);
