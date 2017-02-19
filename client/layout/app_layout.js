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

let navDirection;

Template.appLayout.rendered = function () {
  this.find('#app-content-container')._uihooks = {
    insertElement: function(node, next) {
      $(node).addClass('sliding-in sliding ' + navDirection);
      $(node).insertBefore(next);

      // start the animation:
      Meteor.setTimeout(function() {
        $(node).removeClass(navDirection);
      }, 200);

      Meteor.setTimeout(function() {
        $(node).removeClass('sliding-in sliding');
      }, 200);
    },

    removeElement: function(node) {
      var direction = navDirection === 'left' ? 'right' : 'left';
      $(node).addClass('sliding ' + direction);
      Meteor.setTimeout(function() {
        $(node).remove();
      }, 200);
    }
  };
};

Template.appLayout.events({
  'click [data-nav-direction]': function (event) {
    navDirection = $(event.currentTarget).data('nav-direction');
  },
});
