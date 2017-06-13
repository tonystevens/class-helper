import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Blaze } from 'meteor/blaze'

import { findCourseTypeById, findKnowledgePointsByIds, insertProblemTemplate, addSingleProblemTemplateToCourse } from '../../../../lib/methods.js';

import './add-course-material-modal.html';

const knowledgepoints = new ReactiveVar(undefined);

Template.addProblemTemplate.onCreated(function onProblemTemplateCreated() {
  this.singleCourse = new ReactiveVar(
    {
      _id: FlowRouter.getParam('_id'),
      name: FlowRouter.getQueryParam('name'),
      coursetype: FlowRouter.getQueryParam('coursetype'),
    });
  this.tableContainer = new ReactiveVar(undefined);

  knowledgepoints.set(findKnowledgePointsByIds(findCourseTypeById(this.singleCourse.get().coursetype).knowledgepoints));
});

Template.addProblemTemplate.onRendered(function onProblemTemplateRendered() {
  const tableContainer = Template.instance().tableContainer;
  if (!tableContainer.get()) {
    tableContainer.set(Template.instance().find('#problem-template-container'));
  }
});

Template.addProblemTemplate.helpers({
  course: () => Template.instance().singleCourse.get(),
});

Template.addProblemTemplate.events({
  'click .add-row': () => {
    Blaze.renderWithData(Template.ProblemTemplateSingleRow, {uniqid: randomId()}, $('#problem-template-container')[0]);
  },
  'click .save-template': (e, template) => {
    const name = template.find('#name').value;
    const description = template.find('#description').value;
    const configs = template.findAll('.problem-set-config');

    if (!isReadyToSave(name, description, configs)) {
      alert('标题，描述，配置都需要填写');
      return false;
    }

    const configsAttribute = [];
    configs.forEach((row) => {
      const rowId = row.id;
      configsAttribute.push({
        knowledgepoint: new Meteor.Collection.ObjectID(template.find(`#${rowId}-0`).value),
        type: template.find(`#${rowId}-1`).value,
        difficulty: template.find(`#${rowId}-1`).value,
        number: template.find(`#${rowId}-2`).value,
      });
    });

    const problemTemplateAttributes = {
      name: name,
      description: description,
      configs: configsAttribute,
    };

    console.log(problemTemplateAttributes);
	  const problemTemplate = insertProblemTemplate(problemTemplateAttributes);
	  const courseId = template.singleCourse.get()._id
	  addSingleProblemTemplateToCourse(courseId, problemTemplate._id);
    swal('模板保存成功', '', 'success');
    FlowRouter.go('courses.show', {_id: courseId});
  },
});

Template.ProblemTemplateSingleRow.helpers({
  knowledgepoints: () => knowledgepoints.get(),
});

Template.ProblemTemplateSingleRow.events({
  'click .remove-row': (e, template) => {
    Blaze.remove(template.view);
  },
});

function randomId() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
}

function isReadyToSave (name, description, configs) {
  return name && name !== '' && description && description !== '' && configs && configs.length !== 0;
}