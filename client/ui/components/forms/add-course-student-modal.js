import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { findStudentsNotInCourse } from '../../../../lib/methods';

import './add-course-student-modal.html';

const selectedStudents = new ReactiveVar([]);

Template.addCourseStudent.onRendered(function onPageOnRendered() {
  if(Meteor.isClient){
    let app = new Framework7();
    let $$ = Dom7;
  }
});

Template.addCourseStudent.helpers({
  numberOfStudents: function(course) {
    if (course) {
      return 50 - selectedStudents.get().length - course.students.length;
    }
  },
  availableStudents: function(course) {
    if (course) {
      return findStudentsNotInCourse(course).fetch();
    }
  }
});