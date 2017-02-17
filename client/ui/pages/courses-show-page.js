import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveForms } from 'meteor/templates:forms';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';

import './courses-show-page.html';
import '../components/courses-show.js';

Template.Courses_show_page.onCreated(function coursesShowPageOnCreated() {
    // this.getCourseId = () => FlowRouter.getParam('_id');
  }
);

Template.Courses_show_page.onRendered(function coursesShowPageOnRendered() {
  this.autorun(() => {
      if (this.subscriptionsReady()) {
        coursesRenderHold.release();
      }
    }
  );
});

Template.Courses_show_page.helpers({
  schema() {
    return courseSchema;
  },
  formData() {
    data = Courses.findOne() || {};
    data
  },
  save() {
    return saveCourse;
  },
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

Template.Courses_show_page.events({
  'click .add-owned-course': function() {
    $('#new_course_modal').addClass('active');
  },
  'click .close-add-owned-course': function() {
    $('#new_course_modal').removeClass('active');
  }
});

ReactiveForms.createFormBlock({
  template: 'modalForm',
  submitType: 'normal',
});

ReactiveForms.createElement({
  template: 'textField',
  passThroughData: true,
  validationEvent: 'keyup',
});

// ReactiveForms.createElement({
//   template: 'textArea',
//   passThroughData: true,
//   validationEvent: 'keyup',
// });
//
// ReactiveForms.createElement({
//   template: 'hiddenField',
//   passThroughData: true,
//   validationEvent: 'change',
// });
//
// ReactiveForms.createElement({
//   template: 'select',
//   passThroughData: true,
//   validationEvent: 'change',
// });

courseSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    instructions: 'Enter Course Name',
  },
  description: {
    type: String,
    instructions: 'Enter Course Description',
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  students: {
    type: [String],
    minCount: 0,
    maxCount: 50,
  }
});

function saveCourse(elements, callbacks, changed) {
  console.log("[forms] Action running!");
  console.log("[forms] Form data!", this);
  console.log("[forms] HTML elements with `.reactive-element` class!", elements);
  console.log("[forms] Callbacks!", callbacks);
  console.log("[forms] Changed fields!", changed);

  console.log('saving new owned course...');
  callbacks.success();
  callbacks.reset();
};
