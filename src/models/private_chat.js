import { Schema, model } from 'mongoose';

const PrivateChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date , default: Date.now},
    isImage: { type: Boolean, default: false },
    isSender: { type: String }
},
    {
        collection: 'Private_Chat',
        versionKey: false
    }
);

export default model('Private_Chat', PrivateChatSchema);
