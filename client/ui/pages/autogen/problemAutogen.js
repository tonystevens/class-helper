import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import { findRandomProblemsets } from '../../../../lib/methods.js';

Template.problemAutogen.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
  this.problemTemplate = new ReactiveVar(FlowRouter.getQueryParam('problemTemplate'));
});

Template.problemAutogen.onRendered(function onTemplateRendered() {
  console.log(this.problemTemplate.get());
});

Template.problemAutogen.helpers({
  course: () => Template.instance().singleCourse.get(),
});