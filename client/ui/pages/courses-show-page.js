import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';

import './courses-show-page.html';
import '../components/courses-show.js';

Template.Courses_show_page.onCreated(function coursesShowPageOnCreated() {
    this.getCourseId = () => FlowRouter.getParam('_id');
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
  coursesArray() {
    const courses = Courses.find({ userId: this.userId }, { sort: {createdAt: -1}});
    return courses;
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
