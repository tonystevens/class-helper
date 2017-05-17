import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './add-course-material-modal.html';

const singleCourse = new ReactiveVar({});

Template.addCourseMaterial.onCreated(function onAddCourseMaterialCreated() {
	singleCourse.set({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
});

Template.addCourseMaterial.helpers({
	course: () => singleCourse.get(),
});
