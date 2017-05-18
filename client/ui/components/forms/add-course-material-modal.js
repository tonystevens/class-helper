import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Files } from '../../../../lib/files.js';

import './add-course-material-modal.html';

const files = new ReactiveVar(undefined);
const dep = new Deps.Dependency();

Template.addCourseMaterial.onCreated(function onAddCourseMaterialCreated() {
	this.singleCourse.set({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
	files.set([]);
	this.currentUpload = new ReactiveVar(false);
	this.uploadQTY = 0;
	this.uploads = new ReactiveVar([]);
	this.addToUploads = (file, template) => {
		const uploads = template.uploads.get();
		uploads.push(file);
		template.uploads.set(uploads);
		template.uploadQTY++;
	};
	this.removeFromUploads = (file, template) => {
		const uploads = template.uploads.get();
		$(uploads).each((i, upload) => {
			if (upload.name === file.name) {
				uploads.splice(i, 1);
				template.uploads.set(uploads);
				return false;
			}
		});
		template.uploadQTY--;
	}
});

Template.addCourseMaterial.helpers({
	attachedFiles: function() {
		dep.depend();
		return files.get();
	},
	course: () => this.singleCourse.get(),
	currentUpload: () => Template.instance().currentUpload.get(),
	isReadyToShowFiles: () => files.get().length !== 0,
	status: () => {
		const uploads = Template.instance().uploads.get();
		const uploadQTY = Template.instance().uploadQTY;
		let i = 0;
		let progress = 0;
		if (uploads) {
			uploads.forEach((upload) => {
				progress += upload.progress.get();
			});
			if (i < uploadQTY) {
				progress += 100 * (uploadQTY - i);
			}
			progress = Math.ceil(progress / uploadQTY);
		}
		return {progress : progress};
	},
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
		if (!files.length) {
			return false;
		}
		template.uploadQTY = files.length;
    $(files.get()).each((i, file) => {
			Files.insert({
				file: file,
				streams: 'dynamic',
				chunkSize: 'dynamic',
			}, false).on('error', (error) => {
				console.log(error);
			}).on('start', () => {
				template.addToUploads(this, template);
			}).start();
	    template.removeFromUploads(file, template);
    });
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