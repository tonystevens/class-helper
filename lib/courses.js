import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Courses = new Mongo.Collection('Courses');

Courses.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

Courses.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    unique: false,
  },
  description: {
    type: String,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  startAt: {
    type: Date,
  },
  endAt: {
    type: Date,
  },
  students: {
    type: [String],
    maxCount: 50,
  },
  code: {
    type: String,
    unique: true,
  },
  materials: {
    type: [String],
  },
  problemtemplates: {
    type: [String],
    optional: true,
  },
  coursetype: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
});

Courses.attachSchema(Courses.schema);

Courses.publicFields = {
  name: 1,
  description: 1,
  userId: 1,
  students: 1,
  createAt: 1,
  startAt: 1,
  endAt: 1,
	materials: 1,
	problemtemplates: 1,
  coursetype: 1,
};


