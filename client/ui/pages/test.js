import { Template } from 'meteor/templating';
import { Images } from '../../../lib/images.js';

Template.test.onCreated(() => {
  let myApp = new Framework7({
    router: false
  });
  let $$ = Dom7;
});

Template.test.onRendered(() => {
  // this.autorun(() => {
  //   if (this.subscriptionsReady()) {
  //   }
  // });
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});

Template.file.helpers({
  imageFile: function () {
    return Images.findOne();
  },
  uploadImages: function () {
    const files = [];
    Images.collection.find({}).forEach(function (fileRef) {
      fileRef.link = Images.link(fileRef, 'thumbnail');
      files.push(fileRef);
    });
    return files;
  }
});