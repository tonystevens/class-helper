import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  defaultTemplate: 'Auth_page',
  defaultLayout: 'appLayout',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {
    top: 'header',
  },
  homeRoutePath: '/',
  redirectTimeout: 4000,
});

AccountsTemplates.addFields([
  {
    _id: 'firstName',
    type: 'text',
    display: 'First Name',
    required: true,
    re: /(?=.*[a-z])(?=.*[A-Z])/,
  },
  {
    _id: 'lastName',
    type: 'text',
    display: 'Last Name',
    required: true,
    re: /(?=.*[a-z])(?=.*[A-Z])/,
  },
  {
    _id: 'role',
    type: 'select',
    displayName: 'Role',
    select: [
      {text: 'Teacher', value: 'teacher'},
      {text: 'Student', value: 'student'},
    ]
  }
]);

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
