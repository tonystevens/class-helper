import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../layout/app_layout.js';
import '../ui/pages/root_redirector.js';

import '../accounts/accounts-template.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('appLayout', { top: 'header', main: 'Auth_page' });
  }
});

FlowRouter.route('/root', {
  name: 'App.root',
  action() {
    if (Meteor.user()) {
      BlazeLayout.render('appLayout', {top: 'header', main: 'app_rootRedirector'});
    } else {
      FlowRouter.go('App.home');
    }
  }
});
