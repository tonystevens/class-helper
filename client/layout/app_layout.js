import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../header.js';
import '../ui/components/app-loading.js';
import './app_layout.html';
import '../ui/pages/coursesIndex.js';

const CONNECTION_ISSUE_TIMEOUT = 5000;

// const showConnectionIssue = new ReactiveVar("false");

Meteor.startup(() => {
  setTimeout(() => {
    // showConnectionIssue(true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appLayout.onCreated(function appLayoutOnCreated() {
  this.subscribe('courses.private');
});

Template.appLayout.events({
  'click [data-toggle-modal]': function(event) {
    const targetModalId = $(event.currentTarget).data('toggle-modal');
    const $targetModal = $('#' + targetModalId);
    $targetModal.toggleClass("active");
  },
});
