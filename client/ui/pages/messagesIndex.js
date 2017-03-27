import 'meteor/templating';

import { findChannelsByOwner, findUserById } from '../../../lib/methods.js';

import './messagesIndex.html';

Template.messagesIndex.helpers({
  ownedChannelsArray: () => {
    return findChannelsByOwner(Meteor.userId());
  },
  findUser: (recipientId) => {
    const recipient = findUserById(recipientId);
    return `${recipient.profile.firstName}, ${recipient.profile.lastName}`;
  }
});