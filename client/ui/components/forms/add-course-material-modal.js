import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Files } from '../../../../lib/files.js';

import './add-course-material-modal.html';

const files = new ReactiveVar(undefined);
const fileReloadDep = new Deps.Dependency();

Template.addCourseMaterial.onCreated(function onAddCourseMaterialCreated() {
	this.singleCourse = new ReactiveVar({_id: FlowRouter.getParam('_id'), name: FlowRouter.getQueryParam('name')});
	files.set([]);
	this.uploadQTY = 0;
	this.uploads = new ReactiveVar([]);
	this.addToUploads = (upload) => {
		let uploads = this.uploads.get();
		if (!uploads) {
			uploads = [];
		}
		uploads.push(upload);
    this.uploads.set(uploads);
	};
	this.removeFromUploads = (file) => {
		const uploads = this.uploads.get();
		$(uploads).each((i, upload) => {
			if (upload.file.name === file.name) {
				uploads.splice(i, 1);
        this.uploads.set(uploads);
        this.uploadQTY--;
				return false;
			}
		});
		if (this.uploadQTY === 0) {
      this.uploads.set(false);
		}
	};
});

Template.addCourseMaterial.helpers({
	attachedFiles: function() {
		fileReloadDep.depend();
		return files.get();
	},
	course: () => Template.instance().singleCourse.get(),
  hasUploads: () => Template.instance().uploads.get(),
	isReadyToShowFiles: () => files.get().length !== 0,
	status: () => {
		const uploads = Template.instance().uploads.get();
		const uploadQTY = Template.instance().uploadQTY;
		let i = 0;
		let progress = 0;
		if (uploads) {
			uploads.forEach((upload) => {
				progress += upload.progress.get();
				i++;
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
			fileReloadDep.changed();
		}
	},
	'click .chip-delete': (e) => {
    e.preventDefault();
    removeFile(e.currentTarget.name);
    fileReloadDep.changed();
	},
	'click .save-material': (e, template) => {
		//TODO insert image, get ids, then insert materials
		if (!files.get().length) {
			return false;
		}
		template.uploadQTY = files.get().length;
    $(files.get()).each((i, file) => {
      const upload = Files.insert({
        file: file,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        onUploaded: (error, fileObj) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(fileObj._id);
          }
        }
      }, false);
      upload.on('error', (error) => {
        console.log(error);
        template.removeFromUploads(file);
      });
      upload.on('start', () => {
        template.addToUploads(upload);
      });
      upload.on('end', () => {
        template.removeFromUploads(file);
      });
      upload.start();
    });
    files.set([]);
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