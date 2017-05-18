import { Template } from 'meteor/templating';
import { Files } from '../../../lib/files.js';

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
      const upload = Files.insert({
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
  },
  // 'click .take-photo-button': (e, template) => {
	//   const onSuccess = function(data) {
	//     // window.resolveLocalFileSystemURL(data, (fileEntry) => {
	//     //   console.log(fileEntry);
	//     //   storeImage(fileEntry, template);
	//     // }, () => {
	//     //   console.log('failed');
	//     // });
	//     storeImage(data, template);
	//   };
	//   const onFail = () => { console.log('failed') };
	//   const options= {
	//     quality: 50,
	//     destinationType: 0, //0: data_url, 1: file_url, 2: native_url
	//     sourceType: 0, //0: photo library, 1: camera, 2: save photo album
	//     encodingType: 0, //0: jpeg, 1: png
	//   };
	//   navigator.camera.getPicture(onSuccess, onFail, options);
	// },
});

Template.file.helpers({
  imageFile: function () {
    return Files.findOne();
  },
  uploadImages: function () {
    const files = [];
    Files.collection.find({}).forEach(function (fileRef) {
      fileRef.link = Files.link(fileRef, 'thumbnail');
      files.push(fileRef);
    });
    return files;
  }
});



// function storeImage(file, template) {
//   const upload = Files.insert({
//     file: file,
//     type: 'image/jpeg',
//     isBase64: true,
//     fileName: 'pic.jpeg',
//     streams: 'dynamic',
//     chunkSize: 'dynamic',
//   }, false);
//
//   upload.on('start', function () {
//     template.currentUpload.set(this);
//   });
//
//   upload.on('end', function (error, fileObj) {
//     if (error) {
//       alert('Error during upload: ' + error);
//     } else {
//       alert('Image "' + fileObj.name + '" successfully added');
//     }
//     template.currentUpload.set(false);
//   });
//
//   upload.start();
// }