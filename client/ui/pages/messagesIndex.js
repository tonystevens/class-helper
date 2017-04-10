import 'meteor/templating';

import { findChannelsByOwner, findChannelsByRecipient, findUserById } from '../../../lib/methods.js';

import './messagesIndex.html';

Template.messagesIndex.helpers({
  ownedChannelsArray: () => {
    return findChannelsByOwner(Meteor.userId());
  },
  participatedChannelArray: () => {
    return findChannelsByRecipient(Meteor.userId());
  },
  findRecipientUser: (channel) => {
    const recipient = findUserById(Meteor.userId() === channel.recipient_id ? channel.owner_id : channel.recipient_id);
    return `${recipient.profile.firstName}, ${recipient.profile.lastName}`;
  },
});