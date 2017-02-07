import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../server/courses/courses.js';

import './courses-show-page.html';

Template.Courses_show_page.onCreated(function coursesShowPageOnCreated() {
    this.getCourseId = () => FlowRouter.getParam('_id');
  }
);

Template.Courses_show_page.onRendered( function coursesShowPageOnRendered() {
  this.autorun(() => {
      if (this.subscriptionsReady()) {
        coursesRenderHold.release();
      }
    }
  );
});

Template.Courses_show_page.helpers({
  coursesIdArray() {
    const instance = Template.instance();
    const courseId = instance.getCourseId();
    return Courses.findOne(courseId) ? [courseId] : [];
  }
});
