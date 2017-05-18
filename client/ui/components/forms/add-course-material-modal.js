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
    e.stopPropagation();
		template.$('#userAttachment').click();
	},
	'change #userAttachment': (e) => {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			$(e.currentTarget.files).each((i, file) => {
				if (!isPreviousUploadedFile(file)) {
					const fileArray = files.get();
          fileArray.push(file);
          files.set(fileArray);
				}
			});
			dep.changed();
		}
	},
	'click .chip-delete': (e) => {
    e.preventDefault();
    removeFile(e.currentTarget.name);
    dep.changed();
	},
	'click .save-material': (e, template) => {
		//TODO insert image, get ids, then insert materials
		console.log(files.get());
	}
});


function isPreviousUploadedFile(file) {
	return files.get().some((oldFile) => oldFile.name === file.name);
}

function removeFile(fileName) {
	let index = files.get().length;
  $(files.get()).each((i, file) => {
    if (file.name === fileName) {
      index = i;
      return false;
		}
	});
  if (index < files.get().length) {
    const fileArray = files.get();
    fileArray.splice(index, 1);
    files.set(fileArray);
	}
}