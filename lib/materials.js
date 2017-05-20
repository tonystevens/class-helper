import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Materials = new Mongo.Collection('materials');

Materials.deny({
  // insert() { return true; },
  // update() { return true; },
  // remove() { return true; },
});

Materials.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  fileIds: {
    type: [String],
    maxCount: 10,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  fileTypes: {
    type: [String],
    maxCount: 10,
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createAt: {
    type: Date,
    denyUpdate: true,
  },
  expireAt: {
    type: Date,
  },
  isPrivate: {
    type: Boolean,
  }
});

Materials.attachSchema(Materials.schema);

Materials.publicFields = {
  subId: 1,
  name: 1,
  description: 1,
  ownerId: 1,
  createAt: 1,
  expireAt: 1,
  isPrivate: 1,
};
