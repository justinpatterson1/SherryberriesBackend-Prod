'use strict';

module.exports = {
  async customRegister(ctx) {
    const { email, username, password, firstName, lastName, role_type } = ctx.request.body;

    console.log('🔥 customRegister controller hit');

    const userService = strapi.plugin('users-permissions').service('user');
    
    // Find the authenticated role
    const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({
      where: { type: 'authenticated' }
    });

  const user = await userService.add({ 
    email, 
    username, 
    password,
    role: authenticatedRole.id,
    provider: 'local',  // Make sure provider is set to 'local'
    confirmed: false,    // Set to true if email confirmation is disabled
    blocked: false  
  });

    // Optional: send email confirmation
    try {
      await userService.sendConfirmationEmail(user);
    } catch (err) {
      console.error('Error sending confirmation email:', err);
    }

    const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: { firstName, lastName, role_type },
    });

    ctx.body = {
      user: updatedUser,
      message: 'User registered successfully',
    };
  },
};