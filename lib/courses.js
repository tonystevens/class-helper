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
  students: {
    type: [String],
    minCount: 0,
    maxCount: 50,
  },
  code: {
    type: String,
    unique: true,
  }
});

Courses.attachSchema(Courses.schema);

Courses.publicFields = {
  name: 1,
  description: 1,
  userId: 1,
  students: 1,
  createAt: 1,
};


