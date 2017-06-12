import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '../layout/app_layout.js';
import '../ui/pages/root_redirector.js';

import '../accounts/accounts-template.js';

FlowRouter.route('/home', {
  name: 'App.home',
  action() {
    Meteor.logout();
    BlazeLayout.render('appLayout', { main: 'Auth_page' });
  }
});

FlowRouter.route('/', {
  name: 'App.root',
  action() {
    if (Meteor.user()) {
      BlazeLayout.render('appLayout', { top: 'header', main: 'app_rootRedirector'});
    } else {
      BlazeLayout.render('splash');
      Meteor.setTimeout(function() {
        FlowRouter.go('App.home');
      }, 2000);
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

FlowRouter.route('/courses/:_id/addMaterial', {
  name: 'courses.addMaterial',
  action() {
    BlazeLayout.render('appLayout', { main: 'addCourseMaterial' });
  },
});

FlowRouter.route('/courses/:_id/addProblemTemplate', {
  name: 'courses.addProblemTemplate',
  action() {
    BlazeLayout.render('appLayout', { main: 'addProblemTemplate' });
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
    BlazeLayout.render('appLayout', { main: 'newChannelPage' });
  }
});

// FlowRouter.route('/', {
//   name: 'test',
//   action() {
//     BlazeLayout.render('appLayout', { main: 'test' });
//   }
// });
