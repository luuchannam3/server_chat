import { Schema, model } from 'mongoose';

const DistrictSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  provinceID: { type: String, ref: 'Province' },
},
{
  collection: 'District'
}
);

export default model('District', DistrictSchema);
