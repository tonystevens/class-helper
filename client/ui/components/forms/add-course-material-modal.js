import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './add-course-material-modal.html';

const singleCourse = new ReactiveVar(undefined);
const files = new ReactiveVar(undefined);
const dep = new Deps.Dependency();

Template.addCourseMaterial.onCreated(function onAddCourseMaterialCreated() {
	singleCourse.set({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
	files.set([]);
	this.currentUpload = new ReactiveVar(false);
});

Template.addCourseMaterial.helpers({
	attachedFiles: function() {
		dep.depend();
		return files.get();
	},
	course: () => singleCourse.get(),
	currentUpload: () => Template.instance().currentUpload.get(),
	isReadyToShowFiles: () => files.get().length !== 0,
});

Template.addCourseMaterial.events({
	'click #uploadIcon': (e, template) => {
		template.$('#userAttachment').click();
	},
	'change #userAttachment': (e, template) => {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			$(e.currentTarget.files).each((i, file) => {
				if (!isPreviousUploadedFile(file)) {
					files.get().push(file);
				}
			});
			console.log(files.get());
			dep.changed();
		}
	}
});

function isPreviousUploadedFile(file) {
	console.log('checking isPreviousUploadedFile');
	files.get().forEach((oldFile) => {
		if (oldFile.name === file.name) {
			console.log('file exist!');
			return true;
		}
	});
	return false;
}