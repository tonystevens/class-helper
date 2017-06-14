import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import { coursesRenderHold } from '../launch-screen.js';

import { Courses } from '../../../lib/courses.js';
import { updateCourse, deleteCourse, removeStudentFromCourse,
  findMaterialByIds, findFilesByIds, findProblemTemplatesByIds,
  findAllProblemsets, findAllKnowledgePoints } from '../../../lib/methods.js';

import './coursesShow.html';

const f7App = new ReactiveVar(undefined);
const studentMap = new Map();
const showFilterIconDep = new Deps.Dependency();
const backslashPlaceholder = '@backslash@';

Template.coursesShow.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar(Courses.findOne({ _id: FlowRouter.getParam('_id')}));
  this.onTimelineTab = new ReactiveVar(false);
  this.filter = new ReactiveVar('all');
	MeteorMathJax.defaultConfig = {
		skipStartupTypeset: false,
		showProcessingMessages: false,
		tex2jax: {
			inlineMath: [['$','$'],['\\(','\\)']]
		}
	};
  this.problemTemplates = new ReactiveVar(undefined);
  this.knowledgepoints = findAllKnowledgePoints();
  // const problems = findAllProblemsets();
});

Template.coursesShow.onRendered(function onTemplateRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      coursesRenderHold.release();
    }
    this.singleCourse.set(Courses.findOne({ _id: FlowRouter.getParam('_id')}));
    this.onTimelineTab = new ReactiveVar(false);
    this.filter.set('all');
  });
  if(Meteor.isClient){
    const app = new Framework7();
    f7App.set(app);
    f7App.get().swiper('.swiper-container', {
      speed: 400,
      pagination:'.swiper-pagination'
    });
  }
  this.problemTemplates.set(findProblemTemplatesByIds(this.singleCourse.get().problemtemplates));
});

Template.coursesShow.helpers({
  course: function() {
    return Template.instance().singleCourse.get();
  },
  problemTemplates: function() {
    return Template.instance().problemTemplates.get();
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
    return FlowRouter.path('courses.addMaterial',
      {_id: _singleCourse._id},
      {name: _singleCourse.name});
  },
  pathForAddProblemTemplate: function () {
    const _singleCourse = Template.instance().singleCourse.get();
    return FlowRouter.path('courses.addProblemTemplate',
      {_id: _singleCourse._id},
      {name: _singleCourse.name, coursetype: _singleCourse.coursetype});
  },
  pathForProblemAutogen: function (problemTemplate) {
    const _singleCourse = Template.instance().singleCourse.get();
    return FlowRouter.path('courses.problemAutogen',
      {_id: _singleCourse._id},
      {name: _singleCourse.name, problemTemplate: problemTemplate});
  },
  courseMaterials: function() {
    if (!Template.instance().singleCourse.get().materials) {
      return [];
    }
    return findMaterialByIds(Template.instance().singleCourse.get().materials)
      .map((material) => {
        material.createDay = moment(material.createAt).format('D');
        material.createMonth = moment(material.createAt).format('MMM');
        material.createTime = moment(material.createAt).format('h:m a');
        material.fileNum = material.fileIds.length;
        return material;
      })
  },
  isTimelineTab: () => {
    showFilterIconDep.depend();
    return Template.instance().onTimelineTab.get();
  },
  isInCategory: (category) => {
    const filterVal = Template.instance().filter.get();
    return (category && category === filterVal) || filterVal === 'all';
  },
	getKnowledgePointNameById: (knowledgePointIdStr) => {
  	const kps = Template.instance().knowledgepoints;
  	if (kps && kps.length !== 0) {
		  return kps.find(kp => kp._id._str === knowledgePointIdStr).name;
	  }
	},
	getProblemType: (typeNum) => {
  	let type = '';
  	switch (Number(typeNum)) {
		  case 0:
		  	type ='填空题';
		  	break;
		  case 1:
			  type ='解答题';
			  break;
		  case 2:
			  type ='选择题';
			  break;
		  case 3:
			  type ='计算题';
			  break;
		  default:
			  type ='不限';
			  break;
	  }
	  return type;
	},
	getProblemDifficulty: (difficultyNum) => {
  	let difficulty = '';
		switch (Number(difficultyNum)) {
			case 0:
				difficulty = '简单';
				break;
			case 1:
				difficulty = '中等';
				break;
			case 2:
				difficulty = '困难';
				break;
			default:
				difficulty = '不限';
				break;
		}
		return difficulty;
	}
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
    let enableFilterIcon = false;
    if (e.target.href && e.target.href.endsWith('course-timeline')) {
      enableFilterIcon = true;
    } else if (e.target.parentNode.href && e.target.parentNode.href.endsWith('course-timeline')) {
      enableFilterIcon = true;
    }

    template.onTimelineTab.set(enableFilterIcon);
    showFilterIconDep.changed();
  },
  'click .timeline-item-inner': (e, template) => {
    let $element = $(e.target);
    while (!$element.hasClass('timeline-item')) {
      $element = $element.parent();
    }
	  $element.siblings().removeClass('ready-to-view');
	  $element.toggleClass('ready-to-view');
  },
  'click .view-button': (e) => {
    e.stopPropagation();
	  const material = findMaterialByIds([$(e.target).attr('id')])[0];
	  if (!material.fileIds.length || material.fileIds.length !== material.fileTypes.length) {
      return false;
	  }
	  const filesCursor = findFilesByIds(material.fileIds);
	  const imgLinks = filesCursor.each().map((fileCursor) => fileCursor.link());
	  const photos = {photos: imgLinks};
	  const photoBrowserView = f7App.get().photoBrowser(photos);
	  photoBrowserView.open();
  }
});

Template.popoverFilter.events({
  'click .show-timeline': (e, template) => {
    template.view.parentView._templateInstance.filter.set($(e.target).attr('value'));
    f7App.get().closeModal('.popover-filter');
  }
});

function getUpdateCourseAttributes(template) {
  const courseId = template.singleCourse.get()._id;
  const $courseEditModal = $('#edit-course-modal');
  const courseName = $courseEditModal.find('[name=course_name]').val();
  const courseDescription = $courseEditModal.find('[name=course_description]').val();
  return { courseId, courseName, courseDescription };
}
