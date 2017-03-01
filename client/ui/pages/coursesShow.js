import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';

import { updateCourse, deleteCourse } from '../../../lib/methods.js';

import './coursesShow.html';

const singleCourse = new ReactiveVar(undefined);

Template.coursesShow.onRendered(function coursesShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      coursesRenderHold.release();
    }
    singleCourse.set(Courses.findOne({ _id: FlowRouter.getParam('_id'), userId: Meteor.userId()}));
  });
});

Template.coursesShow.helpers({
  course: function() {
    return singleCourse.get();
  },
  studentIds: function() {
    return singleCourse.get() !== undefined ? singleCourse.get().students : [];
  },
  getStudentNameById: function(studentId) {
    const student = Meteor.users.findOne({_id: studentId});
    if (student === undefined) {
      return '';
    } else {
      return student.profile.firstName + ', ' + student.profile.lastName;
    }
  }
});

Template.coursesShow.events({
  'click .submit-course-edit': function() {
    const course = getUpdateCourseAttributes();
    const updateCourseAttributes = {
      name: course.courseName,
      description: course.courseDescription,
    };
    updateCourse(course.courseId, updateCourseAttributes);
  },
  'click .delete-course': function () {
    swal({
      title: "Are you sure?",
      text: "Course won't be recoverable!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    }, () => {
      swal("Deleted!", "Your course has been deleted.", "success");
      deleteCourse(singleCourse.get()._id);
      FlowRouter.go('courses.index');
    });
  },
});

function getUpdateCourseAttributes() {
  const courseId = singleCourse.get()._id;
  const $courseEditModal = $('#edit-course-modal');
  const courseName = $courseEditModal.find('[name=course_name]').val();
  const courseDescription = $courseEditModal.find('[name=course_description]').val();
  return { courseId, courseName, courseDescription };
}
