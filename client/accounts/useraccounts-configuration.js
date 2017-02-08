import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  defaultTemplate: 'Auth_page',
  defaultLayout: 'appLayout',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {
    top: 'header',
  },
  homeRoutePath: '/root',
  redirectTimeout: 4000,
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password',
});
