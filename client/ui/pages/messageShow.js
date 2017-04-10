import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

import './messageShow.html';

import { findChannelById, findUserById, findMessagesByChannel, insertMessage } from '../../../lib/methods.js';
import { channelRenderHold } from '../launch-screen.js';

const singleChannel = new ReactiveVar(undefined);
const singleRecipient = new ReactiveVar(undefined);

Template.messageShow.onRendered(function coursesShowPageOnRendered() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      channelRenderHold.release();
    }
    singleChannel.set(findChannelById(FlowRouter.getParam('_id')));

    if (Meteor.userId() === singleChannel.get().recipient_id) {
      singleRecipient.set(findUserById(singleChannel.get().owner_id));
    } else {
      singleRecipient.set(findUserById(singleChannel.get().recipient_id));
    }
  });
});

Template.messageShow.helpers({
  channel: () => {
    return singleChannel.get();
  },
  recipient: () => {
    return singleRecipient.get();
  },
  messages: () => {
    console.log('messages');
    const channel = singleChannel.get();
    console.log(channel);
    if (channel) return findMessagesByChannel(channel._id);
  },
  findUserById: (userId) => {
    const user = findUserById(userId);
    return `${user.profile.firstName}, ${user.profile.lastName}`;
  }
});

Template.messageShow.events({
  'click #channel-message-send': () => {
    if (isReadyToSendMessage()) {
      let recipientId = singleChannel.get().recipient_id;
      if (singleChannel.get().recipient_id === Meteor.userId()) {
        recipientId = singleChannel.get().owner_id;
      }
      addMessageToChannel(singleChannel.get()._id, Meteor.userId(), recipientId);
    }
  }
});

function grabNewChannelMessageText() {
  const $newChannelMessageTextField = $('#channel-message-text');
  const newMessage = $newChannelMessageTextField.val();
  $newChannelMessageTextField.val('');
  return newMessage;
}

function addMessageToChannel(channelId, senderId, recipientId) {
  const newMessage = grabNewChannelMessageText().trim();
  if (newMessage !== '') {
    const messageAttributes = {
      channel_id: channelId,
      sender_id: senderId,
      recipient_id: recipientId,
      requireReply: false,
      isReplied: false,
      expireAt: new Date("2018-12-31T00:00:00Z"),
      content: newMessage,
    };
    insertMessage(messageAttributes);
  }
}

function isReadyToSendMessage() {
  return $('#channel-message-text').val().trim() !== '';
}
