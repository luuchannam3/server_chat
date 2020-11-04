# Models - Common Package For Socket Chat

### Usage

```js
const { Conversation, Message } = require('models-common');

const Conversation = new Conversation({
  lm: 'msg_id',
  type: 1,
  mems: ['user_01', 'user_02']
});

const msg = new Message({
  content: 'content',
  uid: 'user_id',
  cid: 'conversation_id'
});
```
