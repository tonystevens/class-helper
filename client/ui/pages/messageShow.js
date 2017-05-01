import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';


import './messageShow.html';

import { findChannelById, findUserById, findMessagesByChannel, insertMessage } from '../../../lib/methods.js';
import { channelRenderHold } from '../launch-screen.js';

const singleChannel = new ReactiveVar(undefined);
const singleRecipient = new ReactiveVar(undefined);
const latestMessageDtTmStr = new WeakMap();

const f7App = new ReactiveVar(undefined);
const myMessages = new ReactiveVar(undefined);
const myMessageBar = new ReactiveVar(undefined);

Template.messageShow.onCreated(function coursesShowPageOnCreated() {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      channelRenderHold.release();
    }

    if(Meteor.isClient){
      const myApp = new Framework7();
      f7App.set(myApp);

      singleChannel.set(findChannelById(FlowRouter.getParam('_id')));

      if (Meteor.userId() === singleChannel.get().recipient_id) {
        singleRecipient.set(findUserById(singleChannel.get().owner_id));
      } else {
        singleRecipient.set(findUserById(singleChannel.get().recipient_id));
      }
    }
  });
});

Template.messageShow.onRendered(function coursesShowPageOnRendered() {
  f7App.get().onPageInit('messageShowPage', (page) => {
    const messages = f7App.get().messages('.messages', {
      autoLayout:true
    });
    myMessages.set(messages);
    const messageBar = f7App.get().messagebar('.messagebar');
    myMessageBar.set(messageBar);
  }).trigger();
});

Template.messageShow.helpers({
  channel: () => {
    return singleChannel.get();
  },
  recipient: () => {
    return singleRecipient.get();
  },
  messages: () => {
    const channel = singleChannel.get();
    if (channel) return findMessagesByChannel(channel._id);
  },
  findUserById: (userId) => {
    const user = findUserById(userId);
    return `${user.profile.firstName}, ${user.profile.lastName}`;
  },
  isCurrentUserMessage: (userId) => {
    return userId === Meteor.userId();
  },
  isReadyToDisplayDateTime: (date) => {
    const dtTmStr = moment(date).format('MMMM Do, h:mm a');
    const isReady = dtTmStr !== latestMessageDtTmStr.get(this);
    if (isReady) {
      latestMessageDtTmStr.set(this, dtTmStr);
    }
    return isReady;
  },
  getDateTimeStr: () => {
    return latestMessageDtTmStr.get(this);
  }
});

Template.messageShow.events({
  'click .messagebar .link': () => {
    const messageText = myMessageBar.get().value().trim();
    if (messageText.length === 0) return;
    let recipientId = singleChannel.get().recipient_id;
    if (singleChannel.get().recipient_id === Meteor.userId()) {
      recipientId = singleChannel.get().owner_id;
    }
    addMessageToChannel(singleChannel.get()._id, Meteor.userId(), recipientId, messageText);
    myMessageBar.get().clear();
    myMessages.get().scrollMessages();
  }
});

function addMessageToChannel(channelId, senderId, recipientId, newMessage) {
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
