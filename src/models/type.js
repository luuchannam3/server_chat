const avro = require('avsc');

const avroSchema = {
  name: 'MessageType',
  type: 'record',
  fields: [
    {
      name: 'conversation_id',
      type: 'string'
    },
    {
        name: 'Content',
        type: 'string'
    },
    {
      name: 'isSender',
      type: 'string'
    }
  ]
};

const type = avro.parse(avroSchema);

module.exports = type;