const { Schema, model } = require('mongoose');

/**
 * content: text msg or image path
 * isImg: check type msg
 * uid: user.id send message
 */
const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    isImg: { type: Boolean, default: false },
    uid: { type: String, required: true, ref: 'User' },
    cid: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  },
  {
    collection: 'message',
    versionKey: false,
    timestamps: true,
  },
);

module.exports = model('Message', MessageSchema);
