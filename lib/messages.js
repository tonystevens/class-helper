import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Messages = new Mongo.Collection( 'messages' );

Messages.deny({
  // insert: () => true,
  // update: () => true,
  // remove: () => true
});

Messages.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  channel_id: {
    type: String,
    optional: false,
  },
  sender_id: {
    type: String,
    optional: false,
  },
  recipient_id: {
    type: String,
    optional: false,
  },
  requireReply: {
    type: Boolean,
    optional: false,
  },
  isReplied: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  expireAt: {
    type: Date,
  },
  content: {
    type: String,
  }
});
