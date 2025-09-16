'use strict';

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/new-auth/custom-register', // ✅ Use a custom path!
      handler: 'new-auth.customRegister',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
