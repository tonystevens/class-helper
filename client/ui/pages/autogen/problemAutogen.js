import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

const retrieveProblemsets = (method) => new Promise((resolve, reject) => {
	Meteor.call(method, (error, result) => {
			if(error) reject(error);
      resolve(result);
		}
	);
});

Template.problemAutogen.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
  this.problemTemplate = new ReactiveVar(FlowRouter.getQueryParam('problemTemplate'));
	this.problemsets = new ReactiveVar(undefined);
});

Template.problemAutogen.onRendered(function onTemplateRendered() {
	retrieveProblemsets('findRandomProblemsets').then((val) => {
	  this.problemsets.set(val);
	  console.log(this.problemsets.get());
  });
});

Template.problemAutogen.helpers({
  course: () => Template.instance().singleCourse.get(),
});