import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Channels = new Mongo.Collection( 'channels' );

Channels.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Channels.deny({
  // insert: () => true,
  // update: () => true,
  // remove: () => true
});

Channels.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    optional: false,
  },
  subject: {
    type: String,
    optional: false,
  },
  recipient_id: {
    type: String,
    optional: false,
  },
  owner_id: {
    type: String,
    optional: false,
  },
  lastEditAt: {
    type: Date,
    optional: false,
  },
  category: {
    type: String,
    optional: false,
  }
});

Channels.publicFields = {
  name: 1,
  subject: 1,
  recipient_id: 1,
  owner_id: 1,
  lastEditAt: 1,
  category: 1,
};