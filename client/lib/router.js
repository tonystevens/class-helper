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
      BlazeLayout.render('appLayout', { top: 'header', main: 'app_rootRedirector'});
    } else {
      FlowRouter.go('App.home');
    }
  }
});

FlowRouter.route('/courses', {
  name: 'courses.index',
  action() {
    BlazeLayout.render('appLayout', { top: 'header', main: 'coursesIndex' });
  },
});

FlowRouter.route('/courses/:_id', {
  name: 'courses.show',
  action() {
    BlazeLayout.render('appLayout', { main: 'coursesShow' });
  },
});

FlowRouter.route('/messages', {
  name: 'messages.index',
  action() {
    BlazeLayout.render('appLayout', { top: 'messageIndexHeader', main: 'messagesIndex' });
  }
});

FlowRouter.route('/messages/:_id', {
  name: 'messages.show',
  action() {
    BlazeLayout.render('appLayout', { main: 'messageShow' });
  },
});

FlowRouter.route('/new-channel', {
  name: 'newChannel',
  action() {
    BlazeLayout.render('appLayout', { top: 'newChannelHeader', main: 'newChannelPage' });
  }
});

FlowRouter.route('/test', {
  name: 'test',
  action() {
    BlazeLayout.render('appLayout', { main: 'test' });
  }
});
