import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';

const myPostSubmitFunc = function(userId, info) {
  Roles.addUsersToRoles(userId, [info.profile.role]);
};

AccountsTemplates.configure({
  postSignUpHook: myPostSubmitFunc,
});