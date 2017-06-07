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
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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
  subId: 1,
  name: 1,
  description: 1,
};

