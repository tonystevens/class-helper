import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

const problemsets = new ReactiveVar(undefined);

Template.problemAutogen.onCreated(function onTemplateCreated() {
  this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
  this.problemTemplate = new ReactiveVar(FlowRouter.getQueryParam('problemTemplate'));
  Meteor.call(
    'findRandomProblemsets',
    function(error, result){
      if(error){
        console.log(error);
      } else {
        problemsets.set(result);
      }
    }
  );
  setTimeout(() => {}, 500);
});

Template.problemAutogen.onRendered(function onTemplateRendered() {
  console.log(problemsets.get());
});

Template.problemAutogen.helpers({
  course: () => Template.instance().singleCourse.get(),
});