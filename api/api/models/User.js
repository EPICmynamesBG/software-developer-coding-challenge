
module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string'
    },
    reset_token: {
      type: 'string'
    }
  },
  customToJSON: function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  },
  beforeCreate: async function (user, proceed) {
    if (!user.password) {
      proceed();
      return;
    }
    sails.helpers.encryptPassword(user.password)
      .then((encrypted) => {
        user.password = encrypted;
        proceed();
      })
      .catch(proceed);
  }
}