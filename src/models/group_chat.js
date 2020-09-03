const GroupChatSchema = new Schema({
    id_Conversation: { type: String },
    Content: { type: String },
    time: { type: Date , default: Date.now},
    isImage: { type: String },
    isSender: { type: String }
},
    {
        collection: 'Group_Chat'
    }
);

export default model('Group_Chat', GroupChatSchema);