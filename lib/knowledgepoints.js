import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const KnowledgePoints = new Mongo.Collection('knowledgepoints');

KnowledgePoints.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

KnowledgePoints.schema = new SimpleSchema({
  _id: {
    type: Meteor.Collection.ObjectID,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

KnowledgePoints.attachSchema(KnowledgePoints.schema);

KnowledgePoints.publicFields = {
  name: 1,
  description: 1,
};

