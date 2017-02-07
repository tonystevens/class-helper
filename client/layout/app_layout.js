import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import '../header.js';
import '../ui/components/app-loading.js';
import './app_layout.html';

const CONNECTION_ISSUE_TIMEOUT = 5000;

const showConnectionIssue = new ReactiveVar("false");

Meteor.startup(() => {
  setTimeout(() => {
    showConnectionIssue(true);
  }, CONNECTION_ISSUE_TIMEOUT);
});
