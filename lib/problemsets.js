import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ProblemSets = new Mongo.Collection('problemsets');

ProblemSets.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

ProblemSets.schema = new SimpleSchema({
  _id: {
    type: Meteor.Collection.ObjectID,
  },
  content: {
    type: String,
  },
  knowledgepoint: {
    type: Meteor.Collection.ObjectID,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  difficulty: {
    type: String, //0: 易, 1: 中, 2: 难
  },
  problemtype: {
    type: String, //0: 填空题, 1: 解答题, 2: 选择题, 3: 计算题
  }
});

ProblemSets.attachSchema(ProblemSets.schema);

ProblemSets.publicFields = {
  subId: 1,
  name: 1,
  content: 1,
  knowledgepoint: 1,
  createAt: 1,
  difficulty: 1,
  problemtype: 1,
};
