import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const CourseType = new Mongo.Collection('coursetype');

CourseType.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

CourseType.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  knowledgepoints: {
    type: [Meteor.Collection.ObjectID]
  }
});

CourseType.attachSchema(CourseType.schema);

CourseType.publicFields = {
  name: 1,
  description: 1,
  knowledgepoints: 1,
};

