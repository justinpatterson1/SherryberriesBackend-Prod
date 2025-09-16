'use strict';

module.exports = {
  async register(ctx) {
    const { email, username, password } = ctx.request.body;

    console.log('📨 Registering user:', email);

    // Call Strapi's built-in registration service
    const registration = await strapi
      .plugin('users-permissions')
      .service('auth')
      .register(ctx);

    console.log(
      '✅ User created. Confirmed status:',
      registration.user.confirmed
    );

    return registration;
  }
};
