import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';

import '../components/forms/course-modal.js';

Template.coursesIndex.onCreated(function coursesShowPageOnCreated() {
    // this.getCourseId = () => FlowRouter.getParam('_id');
  }
);

Template.coursesIndex.onRendered(function coursesShowPageOnRendered() {
  this.autorun(() => {
      if (this.subscriptionsReady()) {
        coursesRenderHold.release();
      }
    }
  );
});

Template.coursesIndex.helpers({
  ownedCoursesArray() {
    return Courses.find({ userId: Meteor.userId() }, { sort: {createdAt: -1}});
  },
  joinedCoursesArray() {
    return Courses.find({ students: Meteor.userId() }, { sort: {createdAt: -1}});
  },
  courseArgs(course) {
    const instance = Template.instance();
    return {
      courseReady: instance.subscriptionsReady(),
      course() {
        return course;
      },
    }
  },
});

Template.coursesIndex.events({
  'click .add-owned-course': function() {
    $('#new_course_modal').addClass('active');
  },
  'click .close-add-owned-course': function() {
    $('#new_course_modal').removeClass('active');
  },
  'click .delete-course' : function() {
    
  },
});