import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {
  findChannelsByRecipientAndSubject,
  findChannelsByOwneAndSubject,
  insertChannel,
  insertMessage,
  findMessagesByChannel,
  findOtherUsers,
  findUserById
} from '../../../lib/methods.js';

import './newChannelPage.html';

const channel = new ReactiveVar(undefined);
const dep = new Deps.Dependency();

const f7App = new ReactiveVar(undefined);
const otherUsers = new ReactiveVar([]);
const myMessageBar = new ReactiveVar(undefined);
const recipient = new ReactiveVar(undefined);
const latestMessageDtTmStr = new WeakMap();

Template.newChannelPage.onCreated(() => {
  if(Meteor.isClient){
    const myApp = new Framework7();
    f7App.set(myApp);
    otherUsers.set(findOtherUsers().fetch());
  }
});

Template.newChannelPage.onRendered(() => {
  const myAutoCompleteRecipient = f7App.get().autocomplete({
    input: '#recipient',
    openIn: 'dropdown',
    limit: 8,
    dropdownPlaceholderText:'type a recipient name to search',
    source: function(autocomplete, query, render) {
      const results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      otherUsers.get().forEach((el) => {
        if (el._id !== Meteor.userId()
          && `${el.profile.firstName}, ${el.profile.lastName}`.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          autocomplete.valueProperty = el._id;
          results.push(`${el.profile.firstName}, ${el.profile.lastName}`);
        }
      });
      render(results);
    },
    onChange: function(autocomplete, value) {
      recipient.set(autocomplete.valueProperty);
      if (isFormValid()) updateChannel();
    }
  });
  f7App.get().onPageInit('newChannelPage', (page) => {
    f7App.get().messages('.messages', {
      autoLayout:true
    });
    const messageBar = f7App.get().messagebar('.messagebar');
    myMessageBar.set(messageBar);
  }).trigger();

  // $('#channel-expire-date').dateDropper();
  // $('#channel-expire-time').timeDropper();
});

Template.newChannelPage.helpers({
  getExistingChannelMessages: () => {
    dep.depend();
    if (channel.get()) {
      return findMessagesByChannel(channel.get()._id);
    }
  },
  isCurrentUserMessage: (userId) => {
    return userId === Meteor.userId();
  },
  findUserById: (userId) => {
    const user = findUserById(userId);
    return `${user.profile.firstName}, ${user.profile.lastName}`;
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
  },
});

Template.newChannelPage.events({
  'click .messagebar .link': () => {
    const messageText = myMessageBar.get().value().trim();
    if (messageText.length === 0 || !isFormValid) return;

    let recipientId;
    if (channel.get()) { // previous channel
      recipientId = channel.get().recipient_id;
      if (recipientId === Meteor.userId()) {
        recipientId = channel.get().owner_id;
      }
    } else { // new channel
      const newChannel = createNewChannel();
      channel.set(newChannel);
      recipientId = recipient.get();
    }
    addMessageToChannel(channel.get()._id, Meteor.userId(), recipientId, messageText);
    myMessageBar.get().clear();
    disableFormCriteria();
  },
  'change #subject': () => {
    if (isFormValid()) updateChannel();
  },
});

function isFormValid() {
  return isRecipientValid() && isSubjectValid();
}

function isRecipientValid() {
  return $('#recipient').val().trim() !== '' && recipient.get();
}

function isSubjectValid() {
  return $('#subject').val().trim() !== '';
}

function findExistChannel(userId, subject) {
  //channel exists. current user is owner
  const channelAsOwner = findChannelsByRecipientAndSubject(userId, subject);
  if (channelAsOwner) return channelAsOwner;
  //channel exists. current user is recipient
  const channelAsRecipient = findChannelsByOwneAndSubject(userId, subject);
  if (channelAsRecipient) return channelAsRecipient;
  return undefined;
}

function updateChannel() {
  const subject = $('#subject').val().trim();
  const existChannel = findExistChannel(recipient.get(), subject);
  channel.set(existChannel);
  dep.changed();
}

function createNewChannel() {
  const subject = $('#subject').val().trim();
  const channelAttributes = {
    name: `${Meteor.userId()}_${recipient.get()}_${subject}`,
    recipient_id: recipient.get(),
    subject: subject,
    category: 'other',
  };
  return insertChannel(channelAttributes);
}

function disableFormCriteria() {
  $('#subject').prop('disabled', true);
  $('#recipient').prop('disabled', true);
}

function addMessageToChannel(channelId, senderId, recipientId, newMessage) {
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
