import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';

import { updateCourse, deleteCourse, removeStudentFromCourse, findMaterialByIds } from '../../../lib/methods.js';

import './coursesShow.html';

const f7App = new ReactiveVar(undefined);
const studentMap = new Map();

Template.coursesShow.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar(Courses.findOne({ _id: FlowRouter.getParam('_id')}));
  this.onTimelineTab = new ReactiveVar(false);
});

Template.coursesShow.onRendered(function onTemplateRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      coursesRenderHold.release();
    }
    this.singleCourse.set(Courses.findOne({ _id: FlowRouter.getParam('_id')}));
  });
  if(Meteor.isClient){
    const app = new Framework7();
    f7App.set(app);
    f7App.get().swiper('.swiper-container', {
      speed: 400,
      pagination:'.swiper-pagination'
    });
  }
});

Template.coursesShow.helpers({
  course: function() {
    return Template.instance().singleCourse.get();
  },
  studentIds() {
    const _singleCourse = Template.instance().singleCourse.get();
    return _singleCourse? _singleCourse.students : [];
  },
  getStudentNameById: function(studentId) {
    const student = Meteor.users.findOne({_id: studentId});
    if (student === undefined) {
      return '';
    } else {
      studentMap.set(studentId, student.profile.firstName + ', ' + student.profile.lastName);
      return studentMap.get(studentId);
    }
  },
  pathForAddMaterials: function () {
    const _singleCourse = Template.instance().singleCourse.get();
    return FlowRouter.path('courses.addMaterial', {_id: _singleCourse._id}, {name: _singleCourse.name});
  },
  courseMaterials: () =>  findMaterialByIds(Template.instance().singleCourse.get().materials)
    .map((material) => {
      material.createDay = moment(material.createAt).format('D');
      material.createMonth = moment(material.createAt).format('MMM');
      material.createTime = moment(material.createAt).format('h:m a');
      material.fileNum = material.fileIds.length;
      return material;
    }),
});

Template.coursesShow.events({
  'click .submit-course-edit': function(e, template) {
    const course = getUpdateCourseAttributes(template);
    const updateCourseAttributes = {
      name: course.courseName,
      description: course.courseDescription,
    };
    updateCourse(course.courseId, updateCourseAttributes);
  },
  'click .delete-course': function (e, template) {
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
      deleteCourse(template.singleCourse.get()._id);
      FlowRouter.go('courses.index');
    });
  },
  'click .remove-student': (e, template) => {
    const studentId = e.target.id;
    swal({
      title: `Remove ${studentMap.get(studentId)}?`,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, remove!",
      closeOnConfirm: false
    }, () => {
      removeStudentFromCourse(template.singleCourse.get()._id, studentId);
      swal("Removed!", `${studentMap.get(studentId)} has been removed.`, "success");
    });
  },
  'click .tab-link': (e, template) => {
    // console.log(e.target.parent('a'))
  },
});

function getUpdateCourseAttributes(template) {
  const courseId = template.singleCourse.get()._id;
  const $courseEditModal = $('#edit-course-modal');
  const courseName = $courseEditModal.find('[name=course_name]').val();
  const courseDescription = $courseEditModal.find('[name=course_description]').val();
  return { courseId, courseName, courseDescription };
}
