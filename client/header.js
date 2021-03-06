import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ActiveRoute} from 'meteor/zimme:active-route';
import {FlowRouter} from 'meteor/kadira:flow-router';

import './header.html';

import {findChannelsByOwner} from '../lib/methods.js';

Template.header.events({
  'click .account-logout'() {
    Meteor.logout();
    if (!ActiveRoute.name('App.home')) {
      FlowRouter.go('App.home');
    }
  },
});

Template.header.helpers({
  channelCount: () => {
    return findChannelsByOwner(Meteor.userId()).count();
  },
});
