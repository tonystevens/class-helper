import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { coursesRenderHold } from '../launch-screen.js';

import { findOwnedCourses, findJoinedCourses, findCourseByCourseCd, addStudentToCourse } from '../../../lib/methods.js';

import '../components/forms/new-course-modal.js';

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
    return findOwnedCourses(Meteor.userId());
  },
  joinedCoursesArray() {
    return findJoinedCourses(Meteor.userId());
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
  'click .submit-join-course': () => {
    const courseCd = $('#join-course-modal').find('input[name=course_code]').val();
    const userId = Meteor.userId();
    const course = findCourseByCourseCd(courseCd);
    if (course === undefined) {
      swal({
        title: 'Invalid Course Code',
        type: "error",
      });
    } else if (!course.students.includes(userId)) {
      addStudentToCourse(course._id, userId);
      swal({
        title: 'Course Join Succeed',
        type: "success",
      });
    } else {
      swal({
        title: 'Course Join Failed',
        text: 'You already joined this course',
        type: "warning",
      });
    }
  },
});