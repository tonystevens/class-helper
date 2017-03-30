import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { findChannelsByReceipientAndSubject, insertChannel, insertMessage, findMessagesByChannel } from '../../../lib/methods.js';

import './newChannelPage.html';

const recipients = new ReactiveVar(undefined);
const channel = new ReactiveVar(undefined);
const dep = new Deps.Dependency();

Template.newChannelPage.onRendered(() => {
  // $('#new-channel-message').prop('disabled', true);
  channel.set(undefined);
});

Template.newChannelPage.helpers({
  settings: () => {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          collection: Meteor.users,
          field: 'profile.firstName',
          template: Template.messageRecipientPill,
          noMatchTemplate: Template.serverNoMatch,
          filter: { _id: { $ne: Meteor.userId()} },
          matchAll: true,
          selector: (match) =>{
            regex = new RegExp(match, 'i');
            return {$or: [{'profile.firstName': regex}, {'profile.lastName': regex}]}
          }
        },
      ]
    }
  },
  getMessages: () => {
    dep.depend();
    console.log('In getMessages');
    console.log(channel.get());
    if (channel.get()) {
      return findMessagesByChannel(channel.get()._id);
    }
  },
});

Template.newChannelPage.events({
  'autocompleteselect input': (event, template, rep) => {
    event.target.value = `${rep.profile.firstName}, ${rep.profile.lastName}`;
    recipients.set(rep);
  },
  'click #new-channel-message-send': () => {
    const subject = $('#channel-subject').val().trim();
    const recipient = recipients.get();

    if (subject !== '' && recipient !== undefined) {
      if (channel.get()) {
        console.log('channel exist: cached');
        addMessageToChannel(channel.get()._id, Meteor.userId(), recipient._id);
        dep.changed();
      } else {
        const existChannel = findChannelsByReceipientAndSubject(recipient._id, subject);
        if (existChannel !== undefined) {
          console.log('channel exist: looked up');
          channel.set({ _id: existChannel._id });
          disableSubjectAndRecipientFields();
          addMessageToChannel(channel.get()._id, Meteor.userId(), recipient._id);
          dep.changed();
        } else {
          console.log('create new channel');
          const newChannel = createNewChannel(subject, recipients.get());
          channel.set(newChannel);
          disableSubjectAndRecipientFields();
          addMessageToChannel(channel.get()._id, Meteor.userId(), recipient._id);
          dep.changed();
        }
      }
    }
  },
});

function createNewChannel(subject, recipient) {
  const channelAttributes = {
    name: `${Meteor.userId()}_${recipient._id}_${subject}`,
    recipient_id: recipient._id,
    subject: subject,
    category: 'other',
  };
  return insertChannel(channelAttributes);
}

function disableSubjectAndRecipientFields() {
  $('#channel-subject').prop('disabled', true);
  $('#autocomplete-input').prop('disabled', true);
}

function grabNewChannelMessageText() {
  const $newChannelMessageTextField = $('#new-channel-message-text');
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