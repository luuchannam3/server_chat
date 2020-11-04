const { Schema, model } = require('mongoose');

/**
 * lm: id of last_message
 * ava: url_path to image for conversation
 * type: 1. private chat, 2. group chat
 * name: conversation_name only for group chat
 * mems: array contains user.id
 */
const ConversationSchema = new Schema(
  {
    lm: { type: Schema.Types.ObjectId, ref: 'Message' },
    ava: { type: String },
    type: { type: Number, required: true },
    name: { type: String },
    mems: [{ type: String, ref: 'User' }],
  },
  {
    collection: 'conversation',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = model('Conversation', ConversationSchema);
