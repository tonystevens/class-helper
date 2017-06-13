import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ProblemTemplates = new Mongo.Collection('problemtemplates');

ProblemTemplates.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

ProblemTemplates.schema = new SimpleSchema({
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
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  configs: {
    type: [Object],
    optional: false,
    maxCount: 30,
  },
  'configs.$.knowledgepoint': {
    type: Meteor.Collection.ObjectID,
  },
  'configs.$.type': {
    type: String, //0: 填空题, 1: 解答题, 2: 选择题, 3: 计算题
  },
  'configs.$.difficulty': {
    type: String, //0: 易, 1: 中, 2: 难
  },
  'configs.$.number': {
    type: Number,
  }
});

ProblemTemplates.attachSchema(ProblemTemplates.schema);

ProblemTemplates.publicFields = {
  name: 1,
  description: 1,
  ownerId: 1,
  createAt: 1,
	configs: 1,
};

