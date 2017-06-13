import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { insertCourse, findAllCourseTypes } from '../../../../lib/methods';

import './new-course-modal.html';

const f7App = new ReactiveVar(undefined);

Template.newCourseModal.onCreated(() => {
  this.coursetypes = new ReactiveVar(findAllCourseTypes());
});

Template.newCourseModal.onRendered(() => {
  if(Meteor.isClient){
    const app = new Framework7();
    f7App.set(app);
    f7App.get().calendar({
      input: '#course-start-date',
      dateFormat: 'M dd yyyy',
      minDate: new Date(),
    });
    f7App.get().calendar({
      input: '#course-end-date',
      dateFormat: 'M dd yyyy',
      minDate: new Date(),
    });
  }
});

Template.newCourseModal.helpers({
  allCourseTypes: () => findAllCourseTypes(),
});

Template.newCourseModal.events({
  'click .add-students': () => {
    f7App.get().smartSelectOpen(".add-students select");
  },
  'click .save-course': () => {
    const formData = f7App.get().formToData($('#new_course_form'));
    insertCourse(formData);
    swal("Good job!", "You added a new course!", "success");
    $('#new_course_form')[0].reset();
  }
});
