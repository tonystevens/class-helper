import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { findStudentsNotInCourse, addMultipleStudentsToCourse } from '../../../../lib/methods';

import './add-course-student-modal.html';

const singleCourse = new ReactiveVar(undefined);
const selectedStudents = new ReactiveVar([]);

Template.addCourseStudent.onRendered(function onPageOnRendered() {
  if(Meteor.isClient){
    let app = new Framework7({tapHold: false});
    let $$ = Dom7;
  }
});

Template.addCourseStudent.helpers({
  setCourse: function(course) {
    singleCourse.set(course);
  },
  numberOfStudents: function() {
    if (singleCourse.get()) {
      return 50 - selectedStudents.get().length - singleCourse.get().students.length;
    }
  },
  availableStudents: function() {
    if (singleCourse.get()) {
      return findStudentsNotInCourse(singleCourse.get()).fetch();
    }
  }
});

Template.addCourseStudent.events({
  'click .add-student-finish': () => {
    const selectedStudentIds = [];
    $.each($('input[type=checkbox]:checked'), (i, e) => {
      selectedStudentIds.push($(e).val());
    });
    addMultipleStudentsToCourse(singleCourse.get()._id, selectedStudentIds);
  },
  'taphold .label-checkbox': (e) => {
    console.log('holding it...');
  },
});