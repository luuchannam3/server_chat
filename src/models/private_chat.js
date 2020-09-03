import { Schema, model } from 'mongoose';

const PrivateChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date , default: Date.now},
    isImage: { type: Boolean },
    isSender: { type: String }
},
    {
        collection: 'Private_Chat'
    }
);

export default model('Private_Chat', PrivateChatSchema);
