const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Encrypt password',
  description: 'Encrypt a user password or text',
  inputs: {
    text: {
      type: 'string',
      example: 'P@$$w0rd',
      description: 'the password/text to encrypt',
      required: true
    }
  },
  fn: async function encryptPassword(inputs, exits) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(inputs.text, salt);
    return exits.success(hashed);
  }
};
