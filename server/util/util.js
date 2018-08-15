/* eslint-env node */
const ERRORS = {
  auth: {
    message: '未经授权的',
    status: 401,
    type: 'error',
    detail: '未经授权的'
  },
  account: {
    message: '未经授权的',
    status: 401,
    type: 'error',
    detail: '试图检索该帐户时出错，请确保您已输入正确的证书，然后重试。'
  },
  db: {
    message: '内部服务器错误',
    status: 500,
    type: 'error',
    detail: '检索数据时出错，请确保输入的信息正确，然后再试一次。'
  },
  email: {
    message: '内部服务器错误',
    status: 500,
    type: 'error',
    detail: '您的电子邮件出错，请确保您输入正确的电子邮件，然后再试一次。'
  },
  exists: {
    message: '帐户存在',
    status: 409,
    type: 'error',
    detail: '该帐户已经存在，请使用重置密码工具或创建一个具有不同电子邮件的新帐户。'
  },
  generic: {
    message: '内部服务器错误',
    status: 500,
    type: 'error',
    detail: '内部服务器错误'
  },
  token: {
    message: '内部服务器错误',
    status: 404,
    type: 'error',
    detail: '试图检索该令牌时出错，请稍后再试'
  },
  subscription: {
    message: '内部服务器错误',
    status: 500,
    type: 'error',
    detail: '尝试处理订阅时出错，请稍后再试'
  }
};
var generateError = function(code, detail, response) {
  // eventually put real error log in this function
  console.log('Error Generator: ', detail);
  var err = ERRORS[code];
  return response.status(err.status).send(err);
};
module.exports = {
  generateError: generateError, // i could not get this working quite like vince wanted, i'll come back later but for now it works

  newRequest: function(opts, cb, ogRes) {
    var request = require('request');
    var optsOut = {
      auth: {
        user: process.env.CATTLE_ACCESS_KEY,
        pass: process.env.CATTLE_SECRET_KEY,
      },
      json: true,
    };

    Object.assign(optsOut, opts);

    return request(optsOut, function(err, response, body) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return cb(body, response);
      }

      var errOut = null;
      if (err) {
        errOut = err;
      } else {
        errOut = response;
      }

      console.log('error:', errOut);
      if (ogRes) {
        generateError('account', err, ogRes);
      }
    });
  },
}
