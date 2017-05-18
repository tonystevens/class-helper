import { FilesCollection } from 'meteor/ostrio:files';

export const Files = new FilesCollection({
  collectionName: 'Files',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg|pdf|txt/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, pdf, or plain text file with size equal or less than 10MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Files.find().cursor;
  });
}