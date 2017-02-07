import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export Classes = new Mongo.Collection('Classes');


Classes.deny({
  insert() { return true; },
  update() { return true; },
  delete() { return true; },
});

Classes.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
  },
  incompleteCount: {
    type: Number,
    defaultValue: 0,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  students: {
    type: [String],
    minCount: 0,
    maxCount: 50,
  }
});

Classes.attachSchema(Classes.schema);

Classes.publicFields = {
  name: 1,
  incompleteCount: 1,
  userId: 1,
  students: 1,
  createAt: 1,
};

Classes.helpers({
  editableBy(userId) {
    return this.userId === userId;
  },
});


