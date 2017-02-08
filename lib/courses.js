import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Courses = new Mongo.Collection('Courses');

Courses.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Courses.schema = new SimpleSchema({
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

Courses.attachSchema(Courses.schema);

Courses.publicFields = {
  name: 1,
  incompleteCount: 1,
  userId: 1,
  students: 1,
  createAt: 1,
};


