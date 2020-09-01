import { Schema, model } from 'mongoose';

const PrivateChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date },
    isImage: { type: Boolean },
    isSender: { type: String }
},
    {
        collection: 'Private_Chat'
    }
);


const GroupChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date },
    isImage: { type: String },
    isSender: { type: String }
},
    {
        collection: 'Group_Chat'
    }
);

export default model('Chat', {PrivateChatSchema,GroupChatSchema});
